import SignUpViewPage from "@/features/auth/components/sign-up-view";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata(
  "Sign Up",
  "Sign Up page for authentication.",
);

export default async function Page() {
  return <SignUpViewPage />;
}
