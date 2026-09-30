"use client";

import { useAppForm, useFormFields } from "@/components/ui/tanstack-form";
import { AUTH_PATHS } from "@/config/paths.config";
import Link from "next/link";
import { SignInFormValues, signInSchema } from "../shemas";
import { useTranslations } from "next-intl";

interface SignInFormProps {
  onSubmit: (values: SignInFormValues) => void;
  isPending?: boolean;
}

export default function SignInForm({ onSubmit, isPending }: SignInFormProps) {
  const t = useTranslations();
  const form = useAppForm({
    defaultValues: {
      identifier: "",
      password: "",
    } satisfies SignInFormValues,

    validators: {
      onSubmit: signInSchema(t),
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  const { FormTextField } = useFormFields<SignInFormValues>();

  return (
    <form.AppForm>
      <form.Form className="w-full space-y-2 p-0">
        <FormTextField
          name="identifier"
          label={t("field.email.label")}
          required
          placeholder={t("field.email.placeholder")}
          autoComplete="username"
        />

        <FormTextField
          name="password"
          label={t("field.password.label")}
          required
          type="password"
          placeholder={t("field.password.placeholder")}
          autoComplete="current-password"
        />

        <Link
          href={AUTH_PATHS.FORGOT_PASSWORD}
          className="text-primary underline font-medium text-sm text-right float-end"
        >
          {t("SignIn.forgot-password")}
        </Link>

        <form.SubmitButton className="mt-2 w-full" isLoading={isPending}>
          {t("Common.login")}
        </form.SubmitButton>
      </form.Form>
    </form.AppForm>
  );
}
