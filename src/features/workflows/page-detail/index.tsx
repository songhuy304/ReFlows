import { AgentChatPanel, AgentChatProvider } from "@/components/agent-chat";
import { WorkflowCanvas } from "./components/workflow-canvas";
import { WorkflowHeader } from "./components/workflow-header";

const WORKFLOW_AGENT_SUGGESTIONS = [
  "Explain what this workflow does",
  "Add an approval step after validation",
  "Find missing branches in this flow",
];

interface WorkflowPageDetailProps {
  id: string;
}

const WorkflowPageDetail = ({ id }: WorkflowPageDetailProps) => {
  return (
    <AgentChatProvider>
      <div className="flex min-h-0 min-w-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <WorkflowHeader name={`Workflow #${id}`} />
          <div className="p-4 flex-1 flex">
            <WorkflowCanvas />
          </div>
        </div>
        <AgentChatPanel
          title="New chat"
          description="Ask the agent to explain, build or improve this workflow."
          placeholder="Describe what you want to change..."
          suggestions={WORKFLOW_AGENT_SUGGESTIONS}
        />
      </div>
    </AgentChatProvider>
  );
};

export { WorkflowPageDetail };
