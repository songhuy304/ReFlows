import { ForgotPasswordViewPage } from "@/features/auth/components/forgot-password-view";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata(
  "Forgot Password",
  "Forgot password page for authentication.",
);

export default async function Page() {
  return <ForgotPasswordViewPage />;
}
