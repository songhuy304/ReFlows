"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LoadingPage } from "../loading-page";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { tokenStorage } from "@/lib/auth";
import { selectIsLoading, setUser } from "@/store";
import { AUTH_PATHS } from "@/config/paths.config";
import { useGetMe } from "@/features/auth/hooks";

export default function AppBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const globalLoading = useAppSelector(selectIsLoading);

  const [isHydrated, setIsHydrated] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const accessToken = tokenStorage.getAccess();
    setHasToken(!!accessToken);
    setIsHydrated(true);
  }, []);

  const { data, error, isPending } = useGetMe({
    enabled: isHydrated && hasToken,
  });

  useEffect(() => {
    if (!isHydrated || isPending) return;

    if (!hasToken || error) {
      router.replace(`${AUTH_PATHS.SIGN_IN}?redirect=${window.location.pathname}`);
    }
  }, [isHydrated, isPending, hasToken, error, router]);

  useEffect(() => {
    if (data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  const isAuthorized = isHydrated && hasToken && !!data && !error;

  if (!isHydrated || (hasToken && isPending)) {
    return <LoadingPage />;
  }

  if (!isAuthorized) {
    return <LoadingPage />;
  }

  return (
    <>
      {globalLoading && <LoadingPage />}
      {children}
    </>
  );
}
