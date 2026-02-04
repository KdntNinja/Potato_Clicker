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
      body: JSON.stringify({ username, email, password }),
    });
  }
  async function login(identifier, password) {
    return apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
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

    function getEquippedSkin() {
      if (!Array.isArray(window.skins)) return "default";
      const equipped = window.skins.find(s => s.equipped);
      return equipped ? equipped.id : "default";
    }

    window.getEquippedSkin = getEquippedSkin;

    /* ----- formatting helpers (same as original) ----- */
    function formatScore(num) {
      const units = [
        { value: 1e33, label: "decillion" },
        { value: 1e30, label: "nonillion" },
        { value: 1e27, label: "octillion" },
        { value: 1e24, label: "septillion" },
        { value: 1e21, label: "sextillion" },
        { value: 1e18, label: "quintillion" },
        { value: 1e15, label: "quadrillion" },
        { value: 1e12, label: "trillion" },
        { value: 1e9, label: "billion" },
        { value: 1e6, label: "million" },
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

    const getRankSuffix = (r) => {
      const j = r % 10,
        k = r % 100;
      if (j === 1 && k !== 11) return r + "st";
      if (j === 2 && k !== 12) return r + "nd";
      if (j === 3 && k !== 13) return r + "rd";
      return r + "th";
    };

    /* ----- build HTML ----- */
    const skinId = window.getEquippedSkin
      ? window.getEquippedSkin()
      : "default";
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
          <div class="score">${formatScore(entry.all_time_potatoes)} <img src="assets/variants/${skinId}.png" alt="Potato" class="leaderboard-potato" width="4%"></div>
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
     NEW: Merge remote + local saves, keep the biggest all‑time value,
          and write the merged result back to BOTH storages.
     -------------------------------------------------------------- */
  async function mergeAndPersist(remoteSave) {
    // 1️⃣ Grab whatever we have locally (could be null/undefined)
    const localRaw = localStorage.getItem(LOCAL_SAVE_KEY);
    let localSave = null;
    if (localRaw) {
      try {
        localSave = JSON.parse(localRaw);
      } catch (_) {
        console.warn("Corrupt local save – ignoring");
      }
    }

    // 2️⃣ Start with the remote version (if any)
    const merged = remoteSave ? { ...remoteSave } : {};

    // 3️⃣ Numeric counters – keep the larger value
    const numericKeys = ["potatoes", "allTimePotatoes"];
    numericKeys.forEach((key) => {
      const remoteVal = Number(merged[key]) || 0;
      const localVal =
        localSave && Number(localSave[key]) ? Number(localSave[key]) : 0;
      merged[key] = Math.max(remoteVal, localVal);
    });

    // 4️⃣ Collections – shallow‑merge (union of keys)
    const collectionKeys = ["buildings", "upgrades", "skins"];
    collectionKeys.forEach((col) => {
      merged[col] = {
        ...(localSave?.[col] || {}),
        ...(remoteSave?.[col] || {}),
      };
    });

    // 5️⃣ Persist locally (full save + legacy key)
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(merged));
    localStorage.setItem("allTimePotatoes", merged.allTimePotatoes);

    // 6️⃣ Push merged save back to the server
    try {
      await saveRemote(merged);
    } catch (e) {
      console.warn("Failed to push merged save to server", e);
    }

    // 7️⃣ Populate globals for the rest of the game
    window.potatoes = merged.potatoes || 0;
    window.allTimePotatoes = merged.allTimePotatoes || 0;
    window.buildings = merged.buildings || {};
    window.upgrades = merged.upgrades || {};
    window.skins = merged.skins || {};
  }

  /* --------------------------------------------------------------
     *** ORIGINAL loadGame – retained for completeness ***
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

    // 3️⃣ Initialise globals with safe defaults
    window.potatoes = (saveObj && saveObj.potatoes) || 0;
    window.buildings = (saveObj && saveObj.buildings) || {};
    window.upgrades = (saveObj && saveObj.upgrades) || {};
    window.skins = (saveObj && saveObj.skins) || {};

    // ★★★★★ ALL‑TIME POTATOES HANDLING ★★★★★
    const localAllTime = (saveObj && saveObj.allTimePotatoes) || 0;
    const legacyLocal = Number(localStorage.getItem("allTimePotatoes")) || 0;
    const bestAllTime = Math.max(localAllTime, legacyLocal);

    window.allTimePotatoes = bestAllTime;
    if (!saveObj) saveObj = {};
    saveObj.allTimePotatoes = bestAllTime;
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(saveObj));
    localStorage.setItem("allTimePotatoes", bestAllTime);
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
      skins: window.skins,
    };

    // Persist locally (full save + legacy key)
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(saveObj));
    localStorage.setItem("allTimePotatoes", window.allTimePotatoes);

    // Persist remotely if logged in
    const token = getToken();
    if (token) {
      saveRemote(saveObj).catch((e) =>
        console.warn("Failed to save remotely", e),
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
      await loadGame(); // guest = local only
      return;
    }

    try {
      const user = await me();
      el.textContent = user.username || user.email || "Account";
      farm_name.value = `${user.username || "Player"}'s Potato Farm`;
    } catch (e) {
      el.textContent = "Not signed in";
      farm_name.value = "Guest";
      setToken(null);
      await loadGame();
    }
  }

  /* --------------------------------------------------------------
     DOM ready – login / signup wiring (modified to use handlePostAuth)
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
            "error",
          );
          return;
        }

        try {
          const res = await login(username, password);
          setToken(res.token);
          setStatus(loginStatus, "Logged in successfully!", "success");

          // Load game from database
          if (window.loadGame) {
            try {
              await window.loadGame();
            } catch (e) {
              console.warn("Failed to load game after login", e);
            }
          }

          // Update UI
          await updateAccountUI();
          await updateLeaderboardUI();
        } catch (e) {
          let msg = "Login failed";
          if (e.error) {
            const err = e.error.toLowerCase();
            if (err.includes("user not found"))
              msg = "Username/email not found.";
            else if (err.includes("invalid credentials"))
              msg = "Password incorrect. Please check and try again.";
            else msg = e.error;
          }
          setStatus(loginStatus, msg, "error");
          console.error("login error", e);
        }
      });

    // auto‑load on page load (guest mode)
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

          // Load game from database
          if (window.loadGame) {
            try {
              await window.loadGame();
            } catch (e) {
              console.warn("Failed to load game after signup", e);
            }
          }

          // Update UI
          await updateAccountUI();
          await updateLeaderboardUI();
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
    // expose the new helpers for external use
    loadGame,
    saveGame,
    // optional – expose the merge helper if you ever need it elsewhere
    mergeAndPersist,
  };
})();
