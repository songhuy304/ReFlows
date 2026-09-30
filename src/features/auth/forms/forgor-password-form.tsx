"use client";

import { useAppForm, useFormFields } from "@/components/ui/tanstack-form";
import { forgotPasswordFormSchema, ForgotPasswordFormValues } from "../shemas";

interface Props {
  onSubmit: (values: ForgotPasswordFormValues) => void;
  isPending?: boolean;
}

export default function ForgotPasswordForm({ onSubmit, isPending }: Props) {
  const form = useAppForm({
    defaultValues: {
      email: "",
    },

    validators: {
      onSubmit: forgotPasswordFormSchema,
    },

    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  const { FormTextField } = useFormFields<ForgotPasswordFormValues>();

  return (
    <div className="w-full space-y-4">
      <form.AppForm>
        <form.Form className="w-full space-y-3">
          <FormTextField
            name="email"
            label="Email"
            required
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
          />

          <form.SubmitButton className="w-full" isLoading={isPending}>
            Send reset link
          </form.SubmitButton>
        </form.Form>
      </form.AppForm>
    </div>
  );
}
