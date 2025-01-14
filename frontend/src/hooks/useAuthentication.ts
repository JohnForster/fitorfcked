import { useState } from "react";
import { login } from "../services/loginService";

const TOKEN_KEY = "authToken";
export function useAuthentication() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));

  async function authenticate(email: string, password: string) {
    const token = await login(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setToken(token);
  }

  function clearToken() {
    setToken("");
    localStorage.setItem(TOKEN_KEY, "");
  }

  return {
    loggedIn: !!token,
    authenticate,
    clearToken,
  };
}
