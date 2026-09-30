"use client";

import { useAppForm, useFormFields } from "@/components/ui/tanstack-form";
import { AUTH_PATHS } from "@/config/paths.config";
import GoogleSignInButton from "@/features/auth/components/google-auth-button";
import { signUpFormSchema, SignUpFormValues } from "@/features/auth/shemas";
import { useTranslations } from "next-intl";
import Link from "next/link";
import GithubSignInButton from "../components/github-auth-button";
import { useLoginSocial } from "../hooks/useLoginSocial";

interface SignUpFormProps {
  onSubmit: (values: SignUpFormValues) => void;
  isPending?: boolean;
}

export default function SignUpForm({ onSubmit, isPending }: SignUpFormProps) {
  const t = useTranslations();
  const { loginWithGoogle, loginWithGithub } = useLoginSocial();

  const form = useAppForm({
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    } as SignUpFormValues,
    validators: {
      onSubmit: signUpFormSchema(t),
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  const { FormTextField } = useFormFields<SignUpFormValues>();

  return (
    <div className="w-full space-y-4">
      <form.AppForm>
        <form.Form className="w-full space-y-2 p-0">

          <FormTextField
            name="fullName"
            label={t("field.full-name.label")}
            required
            placeholder={t("field.full-name.placeholder")}
            autoComplete="name"
          />
          <FormTextField
            name="email"
            label={t("field.email.label")}
            required
            type="email"
            placeholder={t("field.email.placeholder")}
            autoComplete="email"
          />
          <FormTextField
            name="password"
            label={t("field.password.label")}
            required
            type="password"
            placeholder={t("field.password.placeholder")}
            autoComplete="new-password"
          />
          <form.SubmitButton className="mt-2 w-full" isLoading={isPending}>
            {t("Common.sign-up")}
          </form.SubmitButton>
        </form.Form>
      </form.AppForm>

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
        <p className="text-sm text-center">
          {t("Common.already-have-account")}{" "}
          <Link
            className={"text-primary underline font-medium"}
            href={AUTH_PATHS.SIGN_IN}
          >
            {t("Common.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
