"use client";

import { useStore } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { useAppForm, useFormFields } from "@/components/ui/tanstack-form";
import { useTranslations } from "next-intl";

import { useChangePassword } from "../hooks/use-change-password";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/profile.schema";

function ChangePasswordForm() {
  const t = useTranslations();

  const { onChangePassword, isPending } = useChangePassword();

  const form = useAppForm({
    defaultValues: {
      confirmPassword: "",
      oldPassword: "",
      newPassword: "",
    } as ChangePasswordFormValues,
    validators: {
      onChange: changePasswordSchema(t),
    },
    onSubmit: ({ value }) => {
      onChangePassword(value, form);
    },
  });

  const { FormTextField } = useFormFields<ChangePasswordFormValues>();

  const { isValid } = useStore(form.store, (state) => ({
    isValid: state.isValid,
  }));

  return (
    <form.AppForm>
      <form.Form className="flex flex-col gap-5 p-0">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <FormTextField
            name="oldPassword"
            type="password"
            label="Old password"
            placeholder="Enter old password"
          />
          <FormTextField
            name="newPassword"
            type="password"
            label="New password"
            placeholder="Enter new password"
          />
          <FormTextField
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            placeholder="Confirm new password"
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" isLoading={isPending} disabled={!isValid}>
            {t("Common.save-changes")}
          </Button>
        </div>
      </form.Form>
    </form.AppForm>
  );
}

export { ChangePasswordForm };
