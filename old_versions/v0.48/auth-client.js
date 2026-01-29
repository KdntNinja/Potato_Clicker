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
  if (!el) return;
  const token = getToken();
  if (!token) {
    el.textContent = "Not signed in";
    return;
  }
  try {
    const user = await me();
    el.textContent = user.username || user.email || "Account";
    // auto-load remote save when signed in
    if (window.loadGame && typeof window.loadGame === "function") {
      try { window.loadGame(); } catch (e) { console.warn("autoload failed", e); }
    }
  } catch (e) {
    el.textContent = "Not signed in";
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

// UI wiring
document.addEventListener("DOMContentLoaded", () => {
  const lUser = document.getElementById("loginUsername");
  const lPass = document.getElementById("loginPassword");
  const lBtn = document.getElementById("loginButton");
  const sUser = document.getElementById("signupUsername");
  const sEmail = document.getElementById("signupEmail");
  const sPass = document.getElementById("signupPassword");
  const sBtn = document.getElementById("signupButton");

  function showMsg(el, msg) {
    if (!el) return;
    el.value = "";
    el.placeholder = msg;
  }

  lBtn && lBtn.addEventListener("click", async () => {
    try {
      const res = await login(lUser.value.trim(), lPass.value);
      setToken(res.token);
      showMsg(lUser, "Logged in");
      showMsg(lPass, "");
      updateAccountUI(); // will trigger autoload
    } catch (e) {
      showMsg(lUser, "Login failed");
      console.error("login error", e);
    }
  });

  sBtn && sBtn.addEventListener("click", async () => {
    try {
      const res = await signup(sUser.value.trim(), sEmail.value.trim(), sPass.value);
      setToken(res.token);
      showMsg(sUser, "Account created");
      updateAccountUI(); // will trigger autoload
    } catch (e) {
      showMsg(sUser, "Sign up failed");
      console.error("signup error", e);
    }
  });

  // try to fetch current user and update UI
  updateAccountUI();
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

