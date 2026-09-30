"use client";
import { Typography } from "@/components/ui/typography";
import { AUTH_PATHS } from "@/config/paths.config";
import SignInForm from "@/features/auth/forms/sign-in.form";
import { tokenStorage } from "@/lib/auth";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { useLoginSocial, useSignIn } from "../hooks";
import { SignInFormValues } from "../shemas";
import GithubSignInButton from "./github-auth-button";
import GoogleSignInButton from "./google-auth-button";

export default function SignInViewPage() {
  const t = useTranslations();
  const [redirectUrl] = useQueryState("redirect");
  const router = useRouter();
  const { mutate: signIn, isPending } = useSignIn();
  const { loginWithGoogle, loginWithGithub } = useLoginSocial();

  const handleSignIn = (values: SignInFormValues) => {
    signIn(values, {
      onSuccess: (data) => {
        toast.success(t("SignIn.sign-in-success"));
        tokenStorage.setTokens(data.data);
        router.push(redirectUrl || "/");
      },
      onError: (error) => {
        toast.error(t(error.message));
      },
    });
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-1">{t("SignIn.title")}</h2>
      <p className="text-muted-foreground text-sm text-center mb-8">
        {t("SignIn.description")}
      </p>
      <div className="w-full space-y-4">
        <SignInForm onSubmit={handleSignIn} isPending={isPending} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              {t("Common.or-continue-with")}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <GoogleSignInButton
            onClick={() => {
              loginWithGoogle();
            }}
          />
          <GithubSignInButton
            onClick={() => {
              loginWithGithub();
            }}
          />
          <Typography variant="paragraph-sm" className="text-center">
            {t("SignIn.no-account")}{" "}
            <Link
              className={"text-primary underline font-medium"}
              href={AUTH_PATHS.SIGN_UP}
            >
              {t("Common.sign-up")}
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}
