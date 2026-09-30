import { authService } from "@/services";
import { ISignInRequest } from "@/services/auth/auth.type";
import { useMutation } from "@tanstack/react-query";

const useSignIn = () => {
  const signInMutation = useMutation({
    mutationFn: (payload: ISignInRequest) => authService.signIn(payload),
  });

  return { ...signInMutation };
};

export { useSignIn };
