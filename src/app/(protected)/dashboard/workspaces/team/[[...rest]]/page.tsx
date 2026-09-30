"use client";

import PageContainer from "@/components/layout/page-container";
import { teamInfoContent } from "@/config/infoconfig";

export default function TeamPage() {
  return (
    <PageContainer
      pageTitle="Team Management"
      pageDescription="Manage your workspace team, members, roles, security and more."
      infoContent={teamInfoContent}
    >
      <div>Team Management</div>
    </PageContainer>
  );
}
