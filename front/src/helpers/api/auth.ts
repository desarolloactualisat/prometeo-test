import { APICore } from "./apiCore";

const api = new APICore();

// account
function login(params: { email: string; password: string }) {
  const baseUrl = "/api/auth/login/";
  return api.create(`${baseUrl}`, params);
}

function logout() {
  const baseUrl = "/api/auth/logout/";
  return api.create(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
  const baseUrl = "/api/auth/register/";
  return api.create(`${baseUrl}`, params);
}

function forgotPassword(params: { username: string }) {
  const baseUrl = "/forgot-password/";
  return api.create(`${baseUrl}`, params);
}

export { login, logout, signup, forgotPassword };
