const validator = require("validator");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend from project root so frontend and API share same origin
app.use(express.static(path.join(__dirname)));
// ensure index is served
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

// Ensure users table exists
async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);

  // New: saves table (one row per user)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS saves (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `);

  // Leaderboard table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      username TEXT NOT NULL,
      all_time_potatoes BIGINT NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}
ensureTables().catch((e) => {
  console.error("Failed to ensure tables", e);
  process.exit(1);
});

function createToken(user) {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
}

async function getUserById(id) {
  const r = await pool.query("SELECT id, username, email, created_at FROM users WHERE id = $1", [id]);
  return r.rows[0];
}

// Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Normalize & validate email
    email = validator.normalizeEmail(email);
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Check if user already exists
    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (exists.rowCount) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert new user
    const insert = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hash]
    );

    // Create token
    const user = insert.rows[0];
    const token = createToken(user);

    // Return token and user
    res.json({ token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const fullUrl = getFullUrl(req);
    const { identifier, password } = req.body; // identifier = email or username
    if (!identifier || !password) return res.status(400).json({ error: "Missing fields" });

    const r = await pool.query("SELECT id, username, email, password_hash FROM users WHERE email = $1 OR username = $1", [identifier]);
    if (!r.rowCount) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = createToken(user);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email }, fullUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

const getFullUrl = (req) => {
  const originalUrl = req.headers["x-original-url"];
  if (originalUrl) {
    const url = new URL(originalUrl, `https://${req.headers.host}`);
    return url.toString();
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  return url.toString();
};

// GET /api/auth/me returns user object if authenticated
app.get("/api/auth/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No token" });
    const token = auth.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(payload.userId);
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// helper to verify token and set req.userId
function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No token" });
    const token = auth.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// New: save game for authenticated user
app.post("/api/auth/save", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const saveData = req.body; // expect full save object
    if (!saveData) return res.status(400).json({ error: "Missing save body" });

    // pg library handles JSON objects directly for JSONB columns
    await pool.query(
      `INSERT INTO saves (user_id, data, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (user_id) DO UPDATE SET data = $2, updated_at = now()`,
      [userId, saveData],
    );

    // Update leaderboard with allTimePotatoes if available
    if (saveData.stats && saveData.stats.allTimePotatoes !== undefined) {
      const user = await getUserById(userId);
      await pool.query(
        `INSERT INTO leaderboard (user_id, username, all_time_potatoes, updated_at)
         VALUES ($1, $2, $3, now())
         ON CONFLICT (user_id) DO UPDATE SET all_time_potatoes = $3, updated_at = now()`,
        [userId, user.username, Math.floor(saveData.stats.allTimePotatoes)],
      );
    }

    res.json({ ok: true });
  } catch (e) {
    console.error("save error", e);
    res.status(500).json({ error: "Server error" });
  }
});

// New: load game for authenticated user
app.get("/api/auth/load", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const r = await pool.query("SELECT data FROM saves WHERE user_id = $1", [userId]);
    if (!r.rowCount) return res.json(null); // No save yet, return null so game starts fresh
    res.json(r.rows[0].data);
  } catch (e) {
    console.error("load error", e);
    res.status(500).json({ error: "Server error" });
  }
});

// Get leaderboard (top 10 players + user's rank if not in top 10)
app.get("/api/leaderboard", async (req, res) => {
  try {
    // Get top 10
    const topPlayers = await pool.query(
      `SELECT username, all_time_potatoes, updated_at 
       FROM leaderboard 
       ORDER BY all_time_potatoes DESC 
       LIMIT 10`
    );

    let userRank = null;
    
    // If user is authenticated, get their rank
    const auth = req.headers.authorization;
    if (auth) {
      try {
        const token = auth.replace("Bearer ", "");
        const payload = jwt.verify(token, JWT_SECRET);
        const userId = payload.userId;
        
        // Get user's rank and score
        const rankQuery = await pool.query(
          `SELECT 
            (SELECT COUNT(*) + 1 FROM leaderboard WHERE all_time_potatoes > l.all_time_potatoes) as rank,
            username,
            all_time_potatoes
           FROM leaderboard l
           WHERE user_id = $1`,
          [userId]
        );
        
        if (rankQuery.rowCount > 0) {
          const userInfo = rankQuery.rows[0];
          // Only include user rank if they're not in top 10
          if (userInfo.rank > 10) {
            userRank = userInfo;
          }
        }
      } catch (e) {
        // Invalid token or user not found, just return top 10
        console.log("Could not get user rank:", e.message);
      }
    }

    res.json({ topPlayers: topPlayers.rows, userRank });
  } catch (e) {
    console.error("leaderboard error", e);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Auth server listening on ${PORT}`);
});

