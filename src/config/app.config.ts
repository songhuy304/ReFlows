export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export const NEXT_PUBLIC_SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "RecruitHub";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const LOGIN_GOOGLE_URL = `${API_URL}/api/v1/auth/google`;
export const LOGIN_GITHUB_URL = `${API_URL}/api/v1/auth/github`;
