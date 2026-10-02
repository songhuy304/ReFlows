import { Icons } from "@/components/icons";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const WorkflowPageList = () => {
  return (
    <PageContainer
      pageTitle="Workflows"
      pageDescription="Workflows are a way to automate your processes."
    >
      <div>Filters</div>
      <div className="flex flex-wrap gap-4">
        <Card className="w-full max-w-xs gap-0 rounded-xl py-3">
          <CardContent className="space-y-3 px-3">
            <div className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center rounded-lg">
              <Icons.media className="size-10 opacity-50" />
            </div>

            <div className="">
              <h3 className="line-clamp-1 text-base font-semibold">OrderDetail Flow</h3>
              <p className="text-muted-foreground text-xs">20-09-2026 10:00</p>
            </div>

            <Link href="/workflows/1">
              <Button size="sm" className="w-full">
                <span>View detail</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export { WorkflowPageList };
