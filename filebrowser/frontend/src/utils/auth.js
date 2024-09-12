import store from "@/store";
import router from "@/router";
import { Base64 } from "js-base64";
import { baseURL } from "@/utils/constants";

export function parseToken(token) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("token malformed");
  }

  const data = JSON.parse(Base64.decode(parts[1]));

  document.cookie = `auth=${token}; path=/`;

  localStorage.setItem("jwt", token);
  store.commit("setJWT", token);
  store.commit("setUser", data.user);
}

export async function validateLogin() {
  try {
    if (localStorage.getItem("jwt")) {
      await renew(localStorage.getItem("jwt"));
    }
  } catch (_) {
    console.warn("Invalid JWT token in storage"); // eslint-disable-line
  }
}

export async function login(username, password, recaptcha) {
  const data = { username, password, recaptcha };

  if (!localStorage.getItem("isOffline")) localStorage.setItem("isOffline", 1);

  if (
    localStorage.getItem("isOffline") &&
    localStorage.getItem("isOffline") == "1"
  ) {
    if (localStorage.getItem("lastRawToken")) {
      const lastRawToken = localStorage.getItem("lastRawToken");
      parseToken(lastRawToken);
    } else
      parseToken(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJ6aC1jbiIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjp0cnVlLCJwZXJtIjp7ImFkbWluIjp0cnVlLCJleGVjdXRlIjp0cnVlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjp0cnVlLCJkb3dubG9hZCI6dHJ1ZX0sImNvbW1hbmRzIjpbXSwibG9ja1Bhc3N3b3JkIjpmYWxzZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2V9LCJpc3MiOiJGaWxlIEJyb3dzZXIiLCJleHAiOjE3MjYwOTgwMDQsImlhdCI6MTcyNjAxMTYwNH0.nWa-2Nscv-Dc0njiJ_T49SktusgkRWY_9RgSNh17_Ek"
      );
    return;
  }

  const res = await fetch(`${baseURL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await res.text();

  if (res.status === 200) {
    localStorage.setItem("lastRawToken", body);
    parseToken(body);
  } else {
    throw new Error(body);
  }
}

export async function renew(jwt) {
  if (
    localStorage.getItem("isOffline") &&
    localStorage.getItem("isOffline") == "1"
  ) {
    if (localStorage.getItem("lastRawToken")) {
      const lastRawToken = localStorage.getItem("lastRawToken");
      parseToken(lastRawToken);
    } else
      parseToken(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJ6aC1jbiIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjp0cnVlLCJwZXJtIjp7ImFkbWluIjp0cnVlLCJleGVjdXRlIjp0cnVlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjp0cnVlLCJkb3dubG9hZCI6dHJ1ZX0sImNvbW1hbmRzIjpbXSwibG9ja1Bhc3N3b3JkIjpmYWxzZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2V9LCJpc3MiOiJGaWxlIEJyb3dzZXIiLCJleHAiOjE3MjYwOTgwMDQsImlhdCI6MTcyNjAxMTYwNH0.nWa-2Nscv-Dc0njiJ_T49SktusgkRWY_9RgSNh17_Ek"
      );
    return;
  }

  const res = await fetch(`${baseURL}/api/renew`, {
    method: "POST",
    headers: {
      "X-Auth": jwt,
    },
  });

  const body = await res.text();

  if (res.status === 200) {
    parseToken(body);
  } else {
    throw new Error(body);
  }
}

export async function signup(username, password) {
  const data = { username, password };

  const res = await fetch(`${baseURL}/api/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status !== 200) {
    throw new Error(res.status);
  }
}

export function logout() {
  document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";

  store.commit("setJWT", "");
  store.commit("setUser", null);
  localStorage.setItem("jwt", null);
  router.push({ path: "/login" });
}
