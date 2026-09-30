import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/hooks/useRedux";
import { useRouter } from "next/navigation";
import { AUTH_PATHS } from "@/config/paths.config";

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    queryClient.clear();
    router.replace(AUTH_PATHS.SIGN_IN);
  };

  return () => {
    handleLogout();
  };
}
