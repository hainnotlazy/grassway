export function getAccessToken() {
  return localStorage.getItem("access_token");
}

export function setAccessToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function removeAccessToken() {
  localStorage.removeItem("access_token");
}

export function isAuthenticated() {
  return !!getAccessToken();
}
