import { PASSWORD_REGEX } from "@/constants";
import z from "zod";

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .regex(
        PASSWORD_REGEX,
        "Password must be 8-72 characters and contain uppercase, lowercase, number and special character",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordFormSchema>;
