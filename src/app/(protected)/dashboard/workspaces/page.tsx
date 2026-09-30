"use client";

import PageContainer from "@/components/layout/page-container";
import { workspacesInfoContent } from "@/config/infoconfig";

export default function WorkspacesPage() {
  return (
    <PageContainer
      pageTitle="Workspaces"
      pageDescription="Manage your workspaces and switch between them"
      infoContent={workspacesInfoContent}
    >
      <div>adasd</div>
    </PageContainer>
  );
}
