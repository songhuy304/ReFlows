import { authService } from "@/services";
import { IResetPasswordRequest } from "@/services/auth/auth.type";
import { useMutation } from "@tanstack/react-query";

const useResetPassword = () => {
  const resetPasswordMutation = useMutation({
    mutationFn: (payload: IResetPasswordRequest) =>
      authService.resetPassword(payload),
  });

  return { ...resetPasswordMutation };
};

export { useResetPassword };
