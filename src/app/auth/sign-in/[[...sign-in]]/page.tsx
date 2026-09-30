import SignInViewPage from "@/features/auth/components/sign-in-view";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata(
  "Sign In",
  "Sign In page for authentication.",
);

export default async function Page() {
  return <SignInViewPage />;
}
