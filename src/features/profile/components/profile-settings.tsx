"use client";

import { useTranslations } from "next-intl";
import { UpdateProfileForm } from "../forms/update-profile-form";
import { ProfileSectionCard } from "./profile-section-card";
import { SecuritySettings } from "./security-settings";

export function ProfileSettings() {
  const t = useTranslations();
  return (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <ProfileSectionCard
        title={t("Profile.title")}
        description={t("Profile.description")}
      >
        <UpdateProfileForm />
      </ProfileSectionCard>

      <SecuritySettings />
    </div>
  );
}
