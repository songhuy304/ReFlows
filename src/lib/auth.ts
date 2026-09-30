import { ppid } from "process";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const tokenStorage = {
  getAccess: () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefresh: () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);

    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  },

  clearTokens: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};
