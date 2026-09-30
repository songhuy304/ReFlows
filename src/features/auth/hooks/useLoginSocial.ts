import { LOGIN_GITHUB_URL, LOGIN_GOOGLE_URL } from "@/config/app.config";

export const useLoginSocial = () => {
  const loginWithGoogle = () => {
    window.location.href = LOGIN_GOOGLE_URL;
  };

  const loginWithGithub = () => {
    window.location.href = LOGIN_GITHUB_URL;
  };

  return { loginWithGoogle, loginWithGithub };
};
