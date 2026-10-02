"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Typography } from "@/components/ui/typography";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useAgentChat } from "./agent-chat-provider";

const AGENT_CHAT_WIDTH = "24rem";

type AgentChatRole = "user" | "assistant";

interface AgentChatMessage {
  id: string;
  role: AgentChatRole;
  content: string;
}

interface AgentChatPanelProps {
  title?: string;
  description?: string;
  placeholder?: string;
  suggestions?: string[];
  /** When provided, the panel is controlled and only renders these messages. */
  messages?: AgentChatMessage[];
  isResponding?: boolean;
  /** A rejected promise restores the typed message into the input. */
  onSendMessage?: (content: string) => void | Promise<void>;
  onReset?: () => void;
  className?: string;
}

interface AgentChatBodyProps extends Omit<AgentChatPanelProps, "className"> {
  onClose: () => void;
}

function AgentChatEmptyState({
  description,
  suggestions,
  onSelectSuggestion,
}: {
  description: string;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
      <Typography variant="h2">Hello!</Typography>
      <p className="text-muted-foreground text-sm mb-3">{description}</p>
    </div>
  );
}

function AgentChatMessageBubble({ message }: { message: AgentChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap wrap-break-word",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function AgentChatThinkingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-2xl px-3 py-2 text-sm">
        <Icons.spinner className="size-4 animate-spin" />
        Thinking...
      </div>
    </div>
  );
}

function AgentChatBody({
  title = "Agent",
  description = "Ask the agent anything to get started.",
  placeholder = "Ask the agent...",
  suggestions = [],
  messages: controlledMessages,
  isResponding = false,
  onSendMessage,
  onReset,
  onClose,
}: AgentChatBodyProps) {
  const [internalMessages, setInternalMessages] = useState<AgentChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledMessages !== undefined;
  const messages = controlledMessages ?? internalMessages;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isResponding]);

  const handleSubmit = async () => {
    const content = input.trim();
    if (!content || isResponding) return;

    if (!isControlled) {
      setInternalMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "user", content },
      ]);
    }
    setInput("");

    try {
      await onSendMessage?.(content);
    } catch {
      setInput(content);
    }
  };

  const handleReset = () => {
    if (isControlled) {
      onReset?.();
    } else {
      setInternalMessages([]);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icons.sparkles2 className="text-primary size-4 shrink-0" />
          <Typography variant="h6" className="truncate">
            {title}
          </Typography>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={handleReset}
            disabled={messages.length === 0 || isResponding}
            aria-label="New chat"
          >
            <Icons.add className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onClose}
            aria-label="Close agent chat"
          >
            <Icons.chevronsRight className="size-4" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {messages.length === 0 && !isResponding ? (
          <AgentChatEmptyState
            description={description}
            suggestions={suggestions}
            onSelectSuggestion={setInput}
          />
        ) : (
          <div className="flex flex-col gap-3 p-3">
            {messages.map((message) => (
              <AgentChatMessageBubble key={message.id} message={message} />
            ))}
            {isResponding && <AgentChatThinkingBubble />}
          </div>
        )}
      </div>

      <div className="shrink-0 p-3">
        <PromptInput
          value={input}
          onValueChange={setInput}
          onSubmit={() => void handleSubmit()}
          isLoading={isResponding}
          maxHeight={160}
          className="rounded-2xl"
        >
          <PromptInputTextarea placeholder={placeholder} />
          <PromptInputActions className="justify-end pt-1">
            <PromptInputAction tooltip="Send message">
              <Button
                size="icon"
                className="size-8 rounded-full"
                onClick={() => void handleSubmit()}
                disabled={!input.trim() || isResponding}
                aria-label="Send message"
              >
                <Icons.arrowUp className="size-4" />
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
}

function AgentChatPanel({ className, ...props }: AgentChatPanelProps) {
  const { open, setOpen } = useAgentChat();
  const isMobile = useIsMobile();
  const title = props.title ?? "Agent";

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="bg-sidebar text-sidebar-foreground w-full p-0 sm:max-w-(--agent-chat-width) [&>button]:hidden"
          style={{ "--agent-chat-width": AGENT_CHAT_WIDTH } as React.CSSProperties}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>Chat with the agent.</SheetDescription>
          </SheetHeader>
          <AgentChatBody {...props} onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      data-state={open ? "expanded" : "collapsed"}
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "text-sidebar-foreground sticky top-0 hidden h-[calc(100dvh-3.5rem)] shrink-0 overflow-hidden border-l transition-[width,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:flex",
        "data-[state=expanded]:w-(--agent-chat-width) data-[state=collapsed]:w-0 data-[state=collapsed]:border-0 data-[state=collapsed]:opacity-0",
        className
      )}
      style={{ "--agent-chat-width": AGENT_CHAT_WIDTH } as React.CSSProperties}
    >
      <div className="bg-sidebar flex h-full w-(--agent-chat-width) shrink-0 flex-col">
        <AgentChatBody {...props} onClose={() => setOpen(false)} />
      </div>
    </aside>
  );
}

export { AgentChatPanel };
export type { AgentChatMessage, AgentChatPanelProps, AgentChatRole };
