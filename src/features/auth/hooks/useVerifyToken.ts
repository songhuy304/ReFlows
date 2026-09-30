import { authService } from "@/services";
import { IVerifyTokenRequest } from "@/services/auth/auth.type";
import { useMutation } from "@tanstack/react-query";

const useVerifyToken = () => {
  const verifyTokenMutation = useMutation({
    mutationFn: (payload: IVerifyTokenRequest) =>
      authService.verifyToken(payload),
  });

  return { ...verifyTokenMutation };
};

export { useVerifyToken };
