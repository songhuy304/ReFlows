import PageContainer from "@/components/layout/page-container";
import { Card, CardContent } from "@/components/ui/card";

const WorkflowPageList = () => {
  return (
    <PageContainer
      pageTitle="Workflows"
      pageDescription="Workflows are a way to automate your processes."
    >
      <div>Filters</div>
      <div className="flex flex-wrap gap-4">
        <Card className="py-2">
          <CardContent className="px-3">ssadas</CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export { WorkflowPageList };
