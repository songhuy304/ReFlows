import PageContainer from "@/components/layout/page-container";

import { ProfileSettings } from "./components/profile-settings";
import { useTranslations } from "next-intl";

function ProfileView() {
  const t = useTranslations("Profile");
  return (
    <PageContainer pageTitle={t("title")} pageDescription={t("description")}>
      <ProfileSettings />
    </PageContainer>
  );
}

export { ProfileView };
