import PageContainer from "@/components/layout/page-container";
import { CreateWorkflowButton } from "./components/create-workflow-button";
import { WorkflowList } from "./components/workflow-list";

const WorkflowPageList = () => {
  return (
    <PageContainer
      pageTitle="Workflows"
      pageDescription="Workflows are a way to automate your processes."
      pageHeaderAction={<CreateWorkflowButton />}
    >
      <WorkflowList />
    </PageContainer>
  );
};

export { WorkflowPageList };
