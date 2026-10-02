"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface AgentChatContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const AgentChatContext = createContext<AgentChatContextValue | null>(null);

function useAgentChat(): AgentChatContextValue {
  const context = useContext(AgentChatContext);
  if (!context) {
    throw new Error("useAgentChat must be used within an AgentChatProvider.");
  }
  return context;
}

interface AgentChatProviderProps {
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AgentChatProvider({ defaultOpen = false, children }: AgentChatProviderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => setOpen((current) => !current), []);

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);

  return <AgentChatContext.Provider value={value}>{children}</AgentChatContext.Provider>;
}

export { AgentChatProvider, useAgentChat };
