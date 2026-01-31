const AUTH_API_BASE = "/api/auth";
const tokenKey = "pc_auth_token";

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

// New: update account display in nav
async function updateAccountUI() {
  const el = document.getElementById("accountName");
  const farm_name = document.getElementById("nameInput");
  if (!el) return;
  const token = getToken();
  if (!token) {
    el.textContent = "Not signed in";
    farm_name.value = "Guest";
    return;
  }
  try {
    const user = await me();
    el.textContent = user.username || user.email || "Account";
    farm_name.value = `${user.username || "Player"}'s Potato Farm`;
    // auto-load remote save when signed in
    if (window.loadGame && typeof window.loadGame === "function") {
      try { window.loadGame(); } catch (e) { console.warn("autoload failed", e); }
    }
  } catch (e) {
    el.textContent = "Not signed in";
    farm_name.value = "Guest";
    setToken(null);
  }
}

async function saveRemote(saveObj) {
  return apiFetch("/save", { method: "POST", body: JSON.stringify(saveObj) });
}
async function loadRemote() {
  return apiFetch("/load", { method: "GET" });
}

window.authApi = { signup, login, me, save: saveRemote, load: loadRemote, setToken, getToken, updateAccountUI };

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
    setStatus(loginStatus, ""); // clear previous
    const username = lUser.value.trim();
    const password = lPass.value;

    if (!username || !password) {
      setStatus(loginStatus, "Please enter both username/email and password.", "error");
      return;
    }

    try {
      const res = await authApi.login(username, password);
      authApi.setToken(res.token);
      setStatus(loginStatus, "Logged in successfully!", "success");
      authApi.updateAccountUI(); // auto-loads game if available
    } catch (e) {
      // Specific feedback
      let msg = "Login failed";
      if (e.error) {
        if (e.error.toLowerCase().includes("user not found")) {
          msg = "Username/email not found.";
        } else if (e.error.toLowerCase().includes("invalid credentials")) {
          msg = "Password incorrect. Please check and try again.";
        } else {
          msg = e.error;
        }
      }
      setStatus(loginStatus, msg, "error");
      console.error("login error", e);
    }
  });
});

// expose for other scripts
window.authApi = {
  signup,
  login,
  me,
  save: saveRemote,
  load: loadRemote,
  setToken,
  getToken,
  updateAccountUI,
};

