"use client";

import { AgentChatPanel, AgentChatProvider } from "@/components/agent-chat";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEY } from "@/config/query-keys";
import type { IResponse } from "@/types/api.type";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { useGetWorkflowDetail, useUpdateWorkflow } from "../../hooks";
import type { IUpdateWorkflowPayload, IWorkflow } from "../../types";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { useWorkflowChat } from "../hooks/use-workflow-chat";
import { useWorkflowEditor } from "../hooks/use-workflow-editor";
import { WorkflowCanvas } from "./workflow-canvas";
import { WorkflowHeader } from "./workflow-header";

const WORKFLOW_AGENT_SUGGESTIONS = [
  "Explain what this workflow does",
  "Add an approval step after validation",
  "Find missing branches in this flow",
];

function WorkflowEditorSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="bg-sidebar flex h-12 shrink-0 items-center justify-between gap-3 border-b px-2 md:px-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="flex flex-1 p-4">
        <Skeleton className="min-h-125 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

interface WorkflowEditorErrorProps {
  message: string;
  onRetry: () => void;
}

function WorkflowEditorError({ message, onRetry }: WorkflowEditorErrorProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <Icons.alertCircle className="text-destructive size-10" />
      <p className="text-muted-foreground max-w-md text-sm">{message}</p>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/workflows">
            <Icons.arrowLeft className="size-4" />
            Back to workflows
          </Link>
        </Button>
        <Button onClick={onRetry}>Try again</Button>
      </div>
    </div>
  );
}

interface WorkflowEditorContentProps {
  workflow: IWorkflow;
}

function WorkflowEditorContent({ workflow }: WorkflowEditorContentProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const editor = useWorkflowEditor(workflow.graph);
  const saveMutation = useUpdateWorkflow();
  const publishMutation = useUpdateWorkflow();
  const renameMutation = useUpdateWorkflow();
  const { isDirty } = editor;
  const chat = useWorkflowChat({
    workflowId: workflow.id,
    getGraph: () => editor.currentGraph,
    onGraphGenerated: editor.applyGraph,
  });
  const displayName = renameMutation.isPending
    ? (renameMutation.variables?.payload.name ?? workflow.name)
    : workflow.name;

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleError = (error: unknown) => {
    toast.error(getApiErrorMessage(error, t));
  };

  const syncWorkflowCache = (response: IResponse<IWorkflow>) => {
    queryClient.setQueryData(QUERY_KEY.WORKFLOW.DETAIL(workflow.id), response);
  };

  const handleSave = () => {
    const graph = editor.currentGraph;

    saveMutation.mutate(
      { id: workflow.id, payload: { graph } },
      {
        onSuccess: (response) => {
          syncWorkflowCache(response);
          editor.markSaved(graph);
          toast.success("Workflow saved");
        },
        onError: handleError,
      }
    );
  };

  const handlePublish = () => {
    const graph = editor.currentGraph;
    const payload: IUpdateWorkflowPayload = isDirty
      ? { graph, status: "PUBLISHED" }
      : { status: "PUBLISHED" };

    publishMutation.mutate(
      { id: workflow.id, payload },
      {
        onSuccess: (response) => {
          syncWorkflowCache(response);
          if (payload.graph) editor.markSaved(payload.graph);
          toast.success("Workflow published");
        },
        onError: handleError,
      }
    );
  };

  const handleRename = (name: string) => {
    renameMutation.mutate(
      { id: workflow.id, payload: { name } },
      {
        onSuccess: (response) => {
          syncWorkflowCache(response);
          toast.success("Workflow renamed");
        },
        onError: handleError,
      }
    );
  };

  return (
    <AgentChatProvider>
      <div className="flex min-h-0 min-w-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <WorkflowHeader
            name={displayName}
            status={workflow.status}
            isSaved={!isDirty}
            isSaving={saveMutation.isPending}
            isPublishing={publishMutation.isPending}
            isRenaming={renameMutation.isPending}
            onRename={handleRename}
            onSave={handleSave}
            onPublish={handlePublish}
          />
          <div className="flex flex-1 p-4">
            <WorkflowCanvas
              nodes={editor.nodes}
              edges={editor.edges}
              setNodes={editor.setNodes}
              setEdges={editor.setEdges}
              fitViewKey={editor.fitViewKey}
            />
          </div>
        </div>
        <AgentChatPanel
          title="New chat"
          description="Ask the agent to explain, build or improve this workflow."
          placeholder="Describe what you want to change..."
          suggestions={WORKFLOW_AGENT_SUGGESTIONS}
          messages={chat.messages}
          isResponding={chat.isResponding}
          onSendMessage={chat.sendMessage}
          onReset={chat.resetChat}
        />
      </div>
    </AgentChatProvider>
  );
}

interface WorkflowEditorProps {
  id: string;
}

function WorkflowEditor({ id }: WorkflowEditorProps) {
  const t = useTranslations();
  const { data, isPending, isError, error, refetch } = useGetWorkflowDetail({ id });

  if (isPending) return <WorkflowEditorSkeleton />;

  if (isError || !data) {
    return (
      <WorkflowEditorError message={getApiErrorMessage(error, t)} onRetry={() => void refetch()} />
    );
  }

  return <WorkflowEditorContent key={data.data.id} workflow={data.data} />;
}

export { WorkflowEditor };
