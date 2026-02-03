(() => {
  const AUTH_API_BASE = "/api/auth";
  const tokenKey = "auth_token";
  const LOCAL_SAVE_KEY = "potatoFarmSave";

  /* --------------------------------------------------------------
     Token helpers (unchanged)
     -------------------------------------------------------------- */
  function setToken(t) {
    if (t) localStorage.setItem(tokenKey, t);
    else localStorage.removeItem(tokenKey);
  }
  function getToken() {
    return localStorage.getItem(tokenKey);
  }

  /* --------------------------------------------------------------
     Generic API wrapper (unchanged)
     -------------------------------------------------------------- */
  async function apiFetch(path, opts = {}) {
    opts.headers = opts.headers || {};
    opts.headers["Content-Type"] = "application/json";
    const token = getToken();
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(AUTH_API_BASE + path, opts);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw body;
    }
    return res.json().catch(() => ({}));
  }

  /* --------------------------------------------------------------
     Auth endpoints (unchanged)
     -------------------------------------------------------------- */
  async function signup(username, email, password) {
    return apiFetch("/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password })
    });
  }
  async function login(identifier, password) {
    return apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password })
    });
  }
  async function me() {
    return apiFetch("/me", { method: "GET" });
  }

  /* --------------------------------------------------------------
     Remote save / load (unchanged)
     -------------------------------------------------------------- */
  async function saveRemote(saveObj) {
    return apiFetch("/save", { method: "POST", body: JSON.stringify(saveObj) });
  }
  async function loadRemote() {
    return apiFetch("/load", { method: "GET" });
  }

  /* --------------------------------------------------------------
     Leaderboard helpers (unchanged – kept for completeness)
     -------------------------------------------------------------- */
  async function fetchLeaderboard() {
    try {
      const headers = { "Content-Type": "application/json" };
      const token = getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/leaderboard", { method: "GET", headers });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    } catch (e) {
      console.error("leaderboard fetch error", e);
      return { topPlayers: [], userRank: null };
    }
  }

  async function updateLeaderboardUI() {
    const leaderboardContainer = document.querySelector(".leaderboard");
    if (!leaderboardContainer) return;

    const data = await fetchLeaderboard();
    const topPlayers = data.topPlayers || [];
    const userRank = data.userRank;

    if (!topPlayers.length) {
      leaderboardContainer.innerHTML =
        '<div class="other"><div class="place">—</div><div class="username">No players yet</div><div class="score">0 potatoes</div></div>';
      return;
    }

    /* ----- formatting helpers (same as original) ----- */
    function formatScore(num) {
      const units = [
        { value: 1e30, label: "decillion" },
        { value: 1e27, label: "nonillion" },
        { value: 1e24, label: "octillion" },
        { value: 1e21, label: "septillion" },
        { value: 1e18, label: "sextillion" },
        { value: 1e15, label: "quintillion" },
        { value: 1e12, label: "quadrillion" },
        { value: 1e9, label: "trillion" },
        { value: 1e6, label: "billion" },
        { value: 1e3, label: "million" }
      ];
      for (const u of units) {
        if (num >= u.value) {
          return (
            (num / u.value).toFixed(2).replace(/\.?0+$/, "") + " " + u.label
          );
        }
      }
      return num.toLocaleString();
    }

    const getRankSuffix = r => {
      const j = r % 10,
        k = r % 100;
      if (j === 1 && k !== 11) return r + "st";
      if (j === 2 && k !== 12) return r + "nd";
      if (j === 3 && k !== 13) return r + "rd";
      return r + "th";
    };

    /* ----- build HTML ----- */
    let html = "";
    topPlayers.forEach((entry, idx) => {
      const rank = idx + 1;
      let cls = "other";
      if (rank === 1) cls = "first";
      else if (rank === 2) cls = "second";
      else if (rank === 3) cls = "third";

      html += `
        <div class="${cls}">
          <div class="place">${getRankSuffix(rank)}</div>
          <div class="username">${entry.username}</div>
          <div class="score">${formatScore(entry.all_time_potatoes)} potatoes</div>
        </div>`;
    });

    if (userRank) {
      html += `
        <div class="other" style="margin-top:10px;border-top:2px solid rgba(255,255,255,0.2);padding-top:10px;">
          <div class="place">${getRankSuffix(userRank.rank)}</div>
          <div class="username">${userRank.username} (You)</div>
          <div class="score">${formatScore(userRank.all_time_potatoes)} potatoes</div>
        </div>`;
    }

    leaderboardContainer.innerHTML = html;
  }

  /* --------------------------------------------------------------
     *** NEW LOGIC: loadGame – pick the larger all‑time value ***
     -------------------------------------------------------------- */
  async function loadGame() {
    const token = getToken();
    let saveObj = null;

    // 1️⃣ Try remote save first (if logged in)
    if (token) {
      try {
        saveObj = await loadRemote(); // may throw
      } catch (e) {
        console.warn("Remote load failed – falling back to localStorage", e);
        saveObj = null;
      }
    }

    // 2️⃣ If remote didn't give us anything, load from localStorage
    if (!saveObj) {
      const localRaw = localStorage.getItem(LOCAL_SAVE_KEY);
      if (localRaw) {
        try {
          saveObj = JSON.parse(localRaw);
        } catch (_) {
          console.warn("Corrupt local save – ignoring");
          saveObj = null;
        }
      }
    }

    // 3️⃣ At this point we have either a save object or nothing.
    //    Initialise globals with safe defaults.
    window.potatoes = (saveObj && saveObj.potatoes) || 0;
    window.buildings = (saveObj && saveObj.buildings) || {};
    window.upgrades = (saveObj && saveObj.upgrades) || {};
    window.skins = (saveObj && saveObj.skins) || {};

    // ------------------------------------------------------------
    // ★★★★★ THE IMPORTANT PART – ALL‑TIME POTATOES ★★★★★
    // ------------------------------------------------------------
    // Get the locally‑saved all‑time value (may be undefined)
    const localAllTime = (saveObj && saveObj.allTimePotatoes) || 0;

    // If we fetched a remote save, it already contains an all‑time field.
    // If not, we still have the local value from step 2.
    // We now compare it with the value that might already sit in plain
    // localStorage (outside of the full save object) – some older
    // versions stored it there separately.
    const legacyLocal = Number(localStorage.getItem("allTimePotatoes")) || 0;

    // Choose the greatest of the three possible sources.
    const bestAllTime = Math.max(localAllTime, legacyLocal);

    // Store the chosen value back to both places so future loads are
    // consistent (full save object and the legacy key).
    window.allTimePotatoes = bestAllTime;
    if (!saveObj) saveObj = {};                 // ensure we have an object to write into
    saveObj.allTimePotatoes = bestAllTime;
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(saveObj));
    localStorage.setItem("allTimePotatoes", bestAllTime); // keep legacy key for safety

    // ------------------------------------------------------------
    // End of all‑time handling
    // ------------------------------------------------------------
  }

  /* --------------------------------------------------------------
     Save game – unchanged except we keep the legacy key in sync
     -------------------------------------------------------------- */
  function saveGame() {
    const saveObj = {
      potatoes: window.potatoes,
      allTimePotatoes: window.allTimePotatoes,
      buildings: window.buildings,
      upgrades: window.upgrades,
      skins: window.skins
    };

    // Persist locally (full save + legacy key)
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(saveObj));
    localStorage.setItem("allTimePotatoes", window.allTimePotatoes);

    // Persist remotely if logged in
    const token = getToken();
    if (token) {
      saveRemote(saveObj).catch(e =>
        console.warn("Failed to save remotely", e)
      );
    }
  }

  /* --------------------------------------------------------------
     Account UI handling (unchanged)
     -------------------------------------------------------------- */
  async function updateAccountUI() {
    const el = document.getElementById("accountName");
    const farm_name = document.getElementById("nameInput");
    if (!el) return;

    const token = getToken();
    if (!token) {
      el.textContent = "Not signed in";
      farm_name.value = "Guest";
      await loadGame(); // load local save
      return;
    }

    try {
      const user = await me();
      el.textContent = user.username || user.email || "Account";
      farm_name.value = `${user.username || "Player"}'s Potato Farm`;
      await loadGame(); // load backend save
    } catch (e) {
      el.textContent = "Not signed in";
      farm_name.value = "Guest";
      setToken(null);
      await loadGame(); // fallback to localStorage
    }
  }

  /* --------------------------------------------------------------
     DOM ready – login / signup wiring (unchanged)
     -------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const lUser = document.getElementById("loginUsername");
    const lPass = document.getElementById("loginPassword");
    const lBtn = document.getElementById("loginButton");
    const loginStatus = document.getElementById("loginStatus");

    function setStatus(el, msg, type = "error") {
      if (!el) return;
      el.textContent = msg;
      el.classList.toggle("success", type === "success");
      el.classList.toggle("error", type === "error");
    }

    lBtn &&
      lBtn.addEventListener("click", async () => {
        setStatus(loginStatus, "");
        const username = lUser.value.trim();
        const password = lPass.value;

        if (!username || !password) {
          setStatus(
            loginStatus,
            "Please enter both username/email and password.",
            "error"
          );
          return;
        }

        try {
          const res = await login(username, password);
          setToken(res.token);
          setStatus(loginStatus, "Logged in successfully!", "success");
          await updateAccountUI();
        } catch (e) {
          let msg = "Login failed";
          if (e.error) {
            const err = e.error.toLowerCase();
            if (err.includes("user not found")) msg = "Username/email not found.";
            else if (err.includes("invalid credentials"))
              msg = "Password incorrect. Please check and try again.";
            else msg = e.error;
          }
          setStatus(loginStatus, msg, "error");
          console.error("login error", e);
        }
      });

    // auto‑load on page load
    updateAccountUI();
    updateLeaderboardUI();

    const sUser = document.getElementById("signupUsername");
    const sEmail = document.getElementById("signupEmail");
    const sPass = document.getElementById("signupPassword");
    const sBtn = document.getElementById("signupButton");
    const signupStatus = document.getElementById("signupStatus");

    sBtn &&
      sBtn.addEventListener("click", async () => {
        setStatus(signupStatus, "");
        const username = sUser.value.trim();
        const email = sEmail.value.trim();
        const password = sPass.value;

        if (!username || !email || !password) {
          setStatus(signupStatus, "Please fill in all fields.", "error");
          return;
        }

        try {
          const res = await signup(username, email, password);
          setToken(res.token);
          setStatus(signupStatus, "Account created successfully!", "success");
          sUser.value = "";
          sEmail.value = "";
          sPass.value = "";
          await updateAccountUI();
        } catch (e) {
          let msg = "Sign up failed";
          if (e.error) {
            const err = e.error.toLowerCase();
            if (err.includes("already exists"))
              msg = "Username or email already exists.";
            else if (err.includes("invalid email"))
              msg = "Please enter a valid email address.";
            else msg = e.error;
          }
          setStatus(signupStatus, msg, "error");
          console.error("signup error", e);
        }
      });
  });

  /* --------------------------------------------------------------
     Export public API for other scripts (script.js, etc.)
     -------------------------------------------------------------- */
  window.authApi = {
    signup,
    login,
    me,
    save: saveRemote,
    load: loadRemote,
    setToken,
    getToken,
    updateAccountUI,
    fetchLeaderboard,
    updateLeaderboardUI,
    // expose the new load/save helpers if other scripts need them
    loadGame,
    saveGame
  };
})();