"use client";

import { useStore } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAppForm, useFormFields } from "@/components/ui/tanstack-form";
import { Typography } from "@/components/ui/typography";

import { useUser } from "@/hooks/useUser";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "../schemas/profile.schema";
import { useUpdateProfile } from "../hooks/user-update-profile";
import { profileMapper } from "../mappers";
import { useEffect } from "react";

function UpdateProfileForm() {
  const { user } = useUser();
  const t = useTranslations();
  const { onUpdateProfile, isPending, isSuccess, data } = useUpdateProfile();

  const form = useAppForm({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
    validators: {
      onSubmit: updateProfileSchema(t),
    },
    onSubmit: ({ value }) => {
      const mapper = profileMapper.toEntity(value);
      onUpdateProfile(mapper);
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    });
  }, [user]);

  const { FormTextField, FormFileUploadField } =
    useFormFields<UpdateProfileFormValues>();

  const { isDirty, isValid } = useStore(form.store, (state) => ({
    isDirty: state.isDirty,
    isValid: state.isValid,
  }));

  return (
    <form.AppForm>
      <form.Form className="flex flex-col gap-0 p-0">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <FormFileUploadField name="avatar" label="Avatar" />

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <FormTextField
              name="fullName"
              label={t("field.full-name.label")}
              placeholder={t("field.full-name.placeholder")}
            />

            <div className="flex flex-col gap-2">
              <FormTextField
                name="email"
                label={t("field.email.label")}
                placeholder={t("field.email.placeholder")}
                disabled
              />
              <Typography
                as="p"
                variant="paragraph-xs"
                className="text-muted-foreground"
              >
                {t("field.email.description")}
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            isLoading={isPending}
            disabled={!isDirty || !isValid}
          >
            {t("Common.save-changes")}
          </Button>
        </div>
      </form.Form>
    </form.AppForm>
  );
}

export { UpdateProfileForm };
