import { ResetPasswordViewPage } from "@/features/auth/components/reset-password-view";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata(
  "Reset Password",
  "Reset password page for authentication.",
);

export default async function Page() {
  return <ResetPasswordViewPage />;
}
