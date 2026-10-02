"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateWorkflow } from "../../hooks";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

const DEFAULT_WORKFLOW_NAME = "Untitled workflow";

export function useCreateAndOpenWorkflow() {
  const t = useTranslations();
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkflow();

  const createAndOpen = () => {
    mutate(
      { name: DEFAULT_WORKFLOW_NAME, graph: { nodes: [], edges: [] } },
      {
        onSuccess: (response) => router.push(`/workflows/${response.data.id}`),
        onError: (error) => toast.error(getApiErrorMessage(error, t)),
      }
    );
  };

  return { createAndOpen, isPending };
}
