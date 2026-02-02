(() => {
  const AUTH_API_BASE = "/api/auth";
  const tokenKey = "pc_auth_token";
  const LOCAL_SAVE_KEY = "potatoFarmSave";

  function setToken(t) {
    if (t) localStorage.setItem(tokenKey, t);
    else localStorage.removeItem(tokenKey);
  }
  function getToken() {
    return localStorage.getItem(tokenKey);
  }

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

  async function signup(username, email, password) {
    return apiFetch("/signup", { method: "POST", body: JSON.stringify({ username, email, password }) });
  }
  async function login(identifier, password) {
    return apiFetch("/login", { method: "POST", body: JSON.stringify({ identifier, password }) });
  }
  async function me() {
    return apiFetch("/me", { method: "GET" });
  }

  // Save game to remote - expects save object from script.js
  async function saveRemote(saveObj) {
    return apiFetch("/save", { method: "POST", body: JSON.stringify(saveObj) });
  }
  
  // Load game from remote
  async function loadRemote() {
    return apiFetch("/load", { method: "GET" });
  }

  // Fetch leaderboard data
  async function fetchLeaderboard() {
    try {
      const headers = { "Content-Type": "application/json" };
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch("/api/leaderboard", {
        method: "GET",
        headers
      });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    } catch (e) {
      console.error("leaderboard fetch error", e);
      return { topPlayers: [], userRank: null };
    }
  }

  // Update leaderboard UI
  async function updateLeaderboardUI() {
    const leaderboardContainer = document.querySelector(".leaderboard");
    if (!leaderboardContainer) return;

    const data = await fetchLeaderboard();
    const topPlayers = data.topPlayers || [];
    const userRank = data.userRank;
    
    if (!topPlayers || topPlayers.length === 0) {
      leaderboardContainer.innerHTML = '<div class="other"><div class="place">—</div><div class="username">No players yet</div><div class="score">0 potatoes</div></div>';
      return;
    }

    // Helper to format numbers with commas
    const formatScore = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + ' million';
      }
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Helper to format rank suffix
    const getRankSuffix = (rank) => {
      const j = rank % 10;
      const k = rank % 100;
      if (j === 1 && k !== 11) return rank + 'st';
      if (j === 2 && k !== 12) return rank + 'nd';
      if (j === 3 && k !== 13) return rank + 'rd';
      return rank + 'th';
    };

    // Generate HTML for each entry
    let html = '';
    topPlayers.forEach((entry, index) => {
      const rank = index + 1;
      let className = 'other';
      let place = getRankSuffix(rank);
      
      if (rank === 1) {
        className = 'first';
      } else if (rank === 2) {
        className = 'second';
      } else if (rank === 3) {
        className = 'third';
      }

      html += `
        <div class="${className}">
          <div class="place">${place}</div>
          <div class="username">${entry.username}</div>
          <div class="score">${formatScore(entry.all_time_potatoes)} potatoes</div>
        </div>
      `;
    });

    // Add user's rank if they're not in top 10
    if (userRank) {
      html += `
        <div class="other" style="margin-top: 10px; border-top: 2px solid rgba(255, 255, 255, 0.2); padding-top: 10px;">
          <div class="place">${getRankSuffix(userRank.rank)}</div>
          <div class="username">${userRank.username} (You)</div>
          <div class="score">${formatScore(userRank.all_time_potatoes)} potatoes</div>
        </div>
      `;
    }

    leaderboardContainer.innerHTML = html;
  }

  // Update account display
  async function updateAccountUI() {
    const el = document.getElementById("accountName");
    const farm_name = document.getElementById("nameInput");
    if (!el) return;

    const token = getToken();
    if (!token) {
      el.textContent = "Not signed in";
      farm_name.value = "Guest";
      await loadGame(); // load localStorage save
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

    lBtn && lBtn.addEventListener("click", async () => {
      setStatus(loginStatus, "");
      const username = lUser.value.trim();
      const password = lPass.value;

      if (!username || !password) {
        setStatus(loginStatus, "Please enter both username/email and password.", "error");
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
          if (e.error.toLowerCase().includes("user not found")) msg = "Username/email not found.";
          else if (e.error.toLowerCase().includes("invalid credentials")) msg = "Password incorrect. Please check and try again.";
          else msg = e.error;
        }
        setStatus(loginStatus, msg, "error");
        console.error("login error", e);
      }
    });

    // auto-load on page load
    updateAccountUI();
    updateLeaderboardUI(); // Load leaderboard on page load

    const sUser = document.getElementById("signupUsername");
    const sEmail = document.getElementById("signupEmail");
    const sPass = document.getElementById("signupPassword");
    const sBtn = document.getElementById("signupButton");
    const signupStatus = document.getElementById("signupStatus");

    sBtn && sBtn.addEventListener("click", async () => {
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
          if (e.error.toLowerCase().includes("already exists")) msg = "Username or email already exists.";
          else if (e.error.toLowerCase().includes("invalid email")) msg = "Please enter a valid email address.";
          else msg = e.error;
        }
        setStatus(signupStatus, msg, "error");
        console.error("signup error", e);
      }
    });
  });

  // Expose API for other scripts
  window.authApi = {
    signup,
    login,
    me,
    save: saveRemote,  // script.js will pass the full save object
    load: loadRemote,
    setToken,
    getToken,
    updateAccountUI,
    fetchLeaderboard,
    updateLeaderboardUI,
  };
})();