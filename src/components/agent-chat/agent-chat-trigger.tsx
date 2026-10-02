"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAgentChat } from "./agent-chat-provider";

interface AgentChatTriggerProps extends React.ComponentProps<typeof Button> {
  label?: string;
}

function AgentChatTrigger({
  label = "Ask Agent",
  className,
  onClick,
  ...props
}: AgentChatTriggerProps) {
  const { open, toggle } = useAgentChat();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-8", open && "bg-accent text-accent-foreground", className)}
          aria-label={label}
          aria-pressed={open}
          onClick={(event) => {
            onClick?.(event);
            toggle();
          }}
          {...props}
        >
          <Icons.sparkles2 className="size-4 text-primary" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

export { AgentChatTrigger };
