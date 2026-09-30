import { QUERY_KEY } from "@/config/query-keys";
import { tokenStorage } from "@/lib/auth";
import { userService } from "@/services";
import { useQuery } from "@tanstack/react-query";

interface UseGetMeOptions {
  enabled?: boolean;
}

const useGetMe = (options?: UseGetMeOptions) => {
  const accessToken = tokenStorage.getAccess();

  return useQuery({
    queryKey: [QUERY_KEY.USER.ROOT],
    queryFn: () => userService.getMe(),
    enabled: !!accessToken && options?.enabled,
    retry: 3,
  });
};

export { useGetMe };
