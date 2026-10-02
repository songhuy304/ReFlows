import { WorkflowEditor } from "./components/workflow-editor";

interface WorkflowPageDetailProps {
  id: string;
}

const WorkflowPageDetail = ({ id }: WorkflowPageDetailProps) => {
  return <WorkflowEditor id={id} />;
};

export { WorkflowPageDetail };
