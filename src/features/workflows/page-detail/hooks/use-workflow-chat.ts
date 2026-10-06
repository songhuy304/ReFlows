"use client";

import type { AgentChatMessage } from "@/components/agent-chat";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useChatWorkflow } from "../../hooks";
import type { IWorkflowGraph } from "../../types";
import { getApiErrorMessage, isRetryableAiError } from "../../utils/get-api-error-message";

const MAX_CHAT_HISTORY = 20;
const AI_UNAVAILABLE_ERROR_KEY = "error.ai.unavailable";

interface UseWorkflowChatOptions {
  workflowId: number;
  getGraph: () => IWorkflowGraph;
  onGraphGenerated: (graph: IWorkflowGraph) => void;
}

export function useWorkflowChat({ workflowId, getGraph, onGraphGenerated }: UseWorkflowChatOptions) {
  const t = useTranslations();
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const { mutateAsync, isPending } = useChatWorkflow();

  const setMessageStatus = (messageId: string, status: AgentChatMessage["status"]) => {
    setMessages((current) =>
      current.map((message) => (message.id === messageId ? { ...message, status } : message))
    );
  };

  const requestReply = async (history: AgentChatMessage[]) => {
    const response = await mutateAsync({
      id: workflowId,
      payload: {
        messages: history.slice(-MAX_CHAT_HISTORY).map(({ role, content }) => ({ role, content })),
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
  };

  const markAsFailed = (messageId: string) => {
    setMessageStatus(messageId, "error");
    toast.error(t(AI_UNAVAILABLE_ERROR_KEY));
  };

  /** Sending a new message abandons any earlier failed one, so the history always ends with this user turn. */
  const sendMessage = async (content: string) => {
    const userMessage: AgentChatMessage = { id: crypto.randomUUID(), role: "user", content };
    const history = [...messages.filter((message) => message.status !== "error"), userMessage];
    setMessages(history);

    try {
      await requestReply(history);
    } catch (error) {
      if (isRetryableAiError(error)) {
        markAsFailed(userMessage.id);
        return;
      }

      setMessages((current) => current.filter((message) => message.id !== userMessage.id));
      toast.error(getApiErrorMessage(error, t));
      throw error;
    }
  };

  const retryMessage = async (messageId: string) => {
    const index = messages.findIndex((message) => message.id === messageId);
    if (index === -1 || isPending) return;

    const history = messages
      .slice(0, index + 1)
      .map((message) => (message.id === messageId ? { ...message, status: undefined } : message));
    setMessageStatus(messageId, undefined);

    try {
      await requestReply(history);
    } catch (error) {
      if (isRetryableAiError(error)) {
        markAsFailed(messageId);
        return;
      }

      setMessageStatus(messageId, "error");
      toast.error(getApiErrorMessage(error, t));
    }
  };

  const resetChat = () => setMessages([]);

  return { messages, isResponding: isPending, sendMessage, retryMessage, resetChat };
}
