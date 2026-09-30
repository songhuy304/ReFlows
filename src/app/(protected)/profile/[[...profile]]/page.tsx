import { ProfileView } from "@/features/profile/profile-view";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata("Profile", "");

export default function ProfilePage() {
  return <ProfileView />;
}
