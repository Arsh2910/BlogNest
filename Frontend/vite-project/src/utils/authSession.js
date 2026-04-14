const AUTH_USER_KEY = "blognest.authUser";
const AUTH_ROLE_KEY = "blognest.authRole";
const AUTH_ID_KEY = "blognest.authId";

export function getStoredAuthUser() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(AUTH_USER_KEY) || "";
}

export function getStoredAuthRole() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(AUTH_ROLE_KEY) || "";
}

export function getStoredAuthId() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(AUTH_ID_KEY) || "";
}

export function setStoredAuthUser(username, role = "", id = "") {
  if (typeof window === "undefined") {
    return;
  }

  if (username) {
    window.localStorage.setItem(AUTH_USER_KEY, username);
    if (role) {
      window.localStorage.setItem(AUTH_ROLE_KEY, role);
    }
    if (id) {
      window.localStorage.setItem(AUTH_ID_KEY, id);
    }
    return;
  }

  window.localStorage.removeItem(AUTH_USER_KEY);
  window.localStorage.removeItem(AUTH_ROLE_KEY);
  window.localStorage.removeItem(AUTH_ID_KEY);
}

export function clearStoredAuthUser() {
  setStoredAuthUser("");
}
