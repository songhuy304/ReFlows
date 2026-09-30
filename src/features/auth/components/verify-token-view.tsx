"use client";

import { Spinner } from "@/components/ui/spinner";
import { AUTH_PATHS } from "@/config/paths.config";
import { useAppDispatch } from "@/hooks/useRedux";
import { setTokens } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useVerifyToken } from "../hooks/useVerifyToken";
import { useTranslations } from "next-intl";

interface IVerifyTokenViewProps {
  token: string;
}

const VerifyTokenView = ({ token }: IVerifyTokenViewProps) => {
  const t = useTranslations();
  const { mutate, isPending } = useVerifyToken();
  const dispatch = useAppDispatch();
  const route = useRouter();

  useEffect(() => {
    if (token) {
      mutate(
        { token },
        {
          onSuccess(data) {
            const { accessToken, refreshToken } = data.data;
            dispatch(
              setTokens({
                accessToken: accessToken ?? "",
                refreshToken: refreshToken ?? "",
              }),
            );
            route.push("/");
          },
          onError(error) {
            toast.error(t(error.message) || "Failed to verify token");
            route.push(AUTH_PATHS.SIGN_IN);
          },
        },
      );
    }
  }, [token, mutate]);

  if (isPending) {
    return <Spinner />;
  }
};

export { VerifyTokenView };
