"use client";

import { Icons } from "@/components/icons";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteWorkflow } from "../../hooks";
import type { IWorkflow } from "../../types";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

interface WorkflowCardProps {
  workflow: IWorkflow;
}

function WorkflowCard({ workflow }: WorkflowCardProps) {
  const t = useTranslations();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteWorkflow, isPending: isDeleting } = useDeleteWorkflow();
  const detailHref = `/workflows/${workflow.id}`;
  const stepCount = workflow.graph.nodes.length;

  const handleDelete = () => {
    deleteWorkflow(workflow.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        toast.success("Workflow deleted");
      },
      onError: (error) => toast.error(getApiErrorMessage(error, t)),
    });
  };

  return (
    <>
      <Card className="gap-0 rounded-xl py-3 transition-shadow hover:shadow-md">
        <CardContent className="space-y-3 px-3">
          <Link
            href={detailHref}
            className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center rounded-lg"
            aria-label={`Open ${workflow.name}`}
          >
            <Icons.flowchart className="size-10 opacity-50" />
          </Link>

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={detailHref} className="hover:underline">
                <h3 className="line-clamp-1 text-base font-semibold">{workflow.name}</h3>
              </Link>
              <p className="text-muted-foreground text-xs">
                Updated {formatDate(workflow.updatedAt, "DD-MM-YYYY HH:mm")}
              </p>
            </div>
          </div>

          <Button size="sm" className="w-full" asChild>
            <Link href={detailHref}>View detail</Link>
          </Button>
        </CardContent>
      </Card>

      <AlertModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete workflow?"
        description={`"${workflow.name}" will be deleted. This action cannot be undone.`}
      />
    </>
  );
}

export { WorkflowCard };
