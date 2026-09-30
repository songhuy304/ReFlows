import { PASSWORD_REGEX } from "@/constants";
import { TFunction } from "@/i18n/config";
import { z } from "zod";

export const updateProfileSchema = (t: TFunction) =>
  z.object({
    fullName: z
      .string()
      .trim()
      .min(1, t("validation.required", { field: t("field.full-name.label") })),
    email: z.email(),
    avatar: z.string(),
  });

export const changePasswordSchema = (t: TFunction) =>
  z
    .object({
      oldPassword: z.string().min(
        1,
        t("validation.required", {
          field: t("field.password.label"),
        })
      ),
      newPassword: z
        .string()
        .regex(PASSWORD_REGEX, t("validation.password-format")),

      confirmPassword: z.string().min(
        1,
        t("validation.required", {
          field: t("field.confirm-password.label"),
        })
      ),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.password-mismatch"),
      path: ["confirmPassword"],
    });

export type UpdateProfileFormValues = z.infer<
  ReturnType<typeof updateProfileSchema>
>;

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
