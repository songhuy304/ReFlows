"use client";

import { useAppForm, useFormFields } from "@/components/ui/tanstack-form";
import { resetPasswordFormSchema, ResetPasswordValues } from "../shemas";

interface Props {
  onSubmit: (values: ResetPasswordValues) => void;
  isPending?: boolean;
}

export default function ResetPasswordForm({ onSubmit, isPending }: Props) {
  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },

    validators: {
      onSubmit: resetPasswordFormSchema,
    },

    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  const { FormTextField } = useFormFields<ResetPasswordValues>();

  return (
    <div className="w-full space-y-4">
      <form.AppForm>
        <form.Form className="w-full space-y-3">
          <FormTextField
            name="password"
            label="Password"
            required
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
          />

          <FormTextField
            name="confirmPassword"
            label="Confirm Password"
            required
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
          />

          <form.SubmitButton className="w-full" isLoading={isPending}>
            Reset Password
          </form.SubmitButton>
        </form.Form>
      </form.AppForm>
    </div>
  );
}
