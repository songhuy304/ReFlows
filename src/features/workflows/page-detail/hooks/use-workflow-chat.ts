"use client";

import type { AgentChatMessage } from "@/components/agent-chat";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useChatWorkflow } from "../../hooks";
import type { IWorkflowGraph } from "../../types";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

const MAX_CHAT_HISTORY = 20;

interface UseWorkflowChatOptions {
  workflowId: number;
  getGraph: () => IWorkflowGraph;
  onGraphGenerated: (graph: IWorkflowGraph) => void;
}

export function useWorkflowChat({ workflowId, getGraph, onGraphGenerated }: UseWorkflowChatOptions) {
  const t = useTranslations();
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const { mutateAsync, isPending } = useChatWorkflow();

  const sendMessage = async (content: string) => {
    const userMessage: AgentChatMessage = { id: crypto.randomUUID(), role: "user", content };
    const history = [...messages, userMessage];
    setMessages(history);

    try {
      const response = await mutateAsync({
        id: workflowId,
        payload: {
          messages: history.slice(-MAX_CHAT_HISTORY).map(({ role, content: text }) => ({
            role,
            content: text,
          })),
          graph: getGraph(),
        },
      });

      const { reply, graph } = response.data;
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);

      if (graph) {
        onGraphGenerated(graph);
        toast.info("AI updated the canvas. Review it and save to keep the changes.");
      }
    } catch (error) {
      setMessages((current) => current.filter((message) => message.id !== userMessage.id));
      toast.error(getApiErrorMessage(error, t));
      throw error;
    }
  };

  const resetChat = () => setMessages([]);

  return { messages, isResponding: isPending, sendMessage, resetChat };
}
