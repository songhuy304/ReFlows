import { WorkflowPageList } from "@/features/workflows";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata("Workflows");

export default function WorkflowsPage() {
  return <WorkflowPageList />;
}
