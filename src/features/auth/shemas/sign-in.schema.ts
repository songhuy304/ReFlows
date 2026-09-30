import { TFunction } from "@/i18n/config";
import { z } from "zod";

export const signInSchema = (t: TFunction) =>
  z.object({
    identifier: z.string().min(
      1,
      t("validation.required", {
        field: t("field.email.label"),
      }),
    ),

    password: z.string().min(
      1,
      t("validation.required", {
        field: t("field.password.label"),
      }),
    ),
  });

export type SignInFormValues = z.infer<ReturnType<typeof signInSchema>>;
