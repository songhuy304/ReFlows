import { AUTH_PATHS } from "@/config/paths.config";
import { VerifyTokenView } from "@/features/auth/components/verify-token-view";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Account",
  robots: {
    index: false,
  },
};

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    redirect(AUTH_PATHS.SIGN_IN);
  }

  if (token) {
    return <VerifyTokenView token={token} />;
  }
}
