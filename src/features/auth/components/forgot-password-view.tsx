"use client";

import { toast } from "sonner";
import ForgotPasswordForm from "../forms/forgor-password-form";
import { useForgotPassword } from "../hooks";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ForgotPasswordViewPage = () => {
  const t = useTranslations();
  const [viewState, setViewState] = useState("default");
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = (values: { email: string }) => {
    forgotPassword(values, {
      onSuccess: () => {
        toast.success("Please check your email for the password reset link.");
        setViewState("success");
      },
      onError(error) {
        toast.error(t(error.message));
      },
    });
  };

  if (viewState === "success") {
    return (
      <div className="w-full max-w-xs mx-auto flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold mb-2">
          Check your email
        </h2>

        <p className="text-muted-foreground text-sm">
          We sent a password reset link to your email.
        </p>
      </div>
    );
  }


  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-1">Forgot password?</h2>

      <p className="text-muted-foreground text-sm text-center mb-8">
        Enter your email to reset your password.
      </p>

      <ForgotPasswordForm onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
};

export { ForgotPasswordViewPage };
