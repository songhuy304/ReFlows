"use client";

import { Icons } from "@/components/icons";
import { PagePagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useGetWorkflows } from "../../hooks";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { useCreateAndOpenWorkflow } from "../hooks/use-create-and-open-workflow";
import {
  useWorkflowListParams,
  WORKFLOW_PAGE_SIZE_OPTIONS,
} from "../hooks/use-workflow-list-params";
import { WorkflowCard } from "./workflow-card";
import { WorkflowListFilters } from "./workflow-list-filters";

const GRID_CLASS_NAME = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function WorkflowListSkeleton({ count }: { count: number }) {
  return (
    <div className={GRID_CLASS_NAME}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-3 rounded-xl border p-3">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}

function WorkflowList() {
  const t = useTranslations();
  const { page, limit, keyword, status, setParams } = useWorkflowListParams();
  const { createAndOpen, isPending: isCreating } = useCreateAndOpenWorkflow();
  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } =
    useGetWorkflows({ page, limit, keyword: keyword || undefined, status: status ?? undefined });

  const hasFilters = Boolean(keyword || status);
  const totalPages = data?.meta.totalPages ?? 0;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      void setParams({ page: totalPages });
    }
  }, [page, totalPages, setParams]);

  const renderContent = () => {
    if (isPending) return <WorkflowListSkeleton count={limit} />;

    if (isError || !data) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border py-16 text-center">
          <Icons.alertCircle className="text-destructive size-8" />
          <p className="text-muted-foreground text-sm">{getApiErrorMessage(error, t)}</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      );
    }

    if (data.data.length === 0) {
      return hasFilters ? (
        <Empty
          className="py-16"
          title="No workflows found"
          description="Try a different keyword or status."
          buttonText="Clear filters"
          onButtonClick={() => void setParams({ keyword: null, status: null, page: 1 })}
        />
      ) : (
        <Empty
          className="py-16"
          title="No workflows yet"
          description="Create your first workflow to start automating your processes."
          buttonText={isCreating ? "Creating..." : "New workflow"}
          onButtonClick={isCreating ? undefined : createAndOpen}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div
          className={cn(GRID_CLASS_NAME, isFetching && isPlaceholderData && "opacity-60 transition-opacity")}
          aria-busy={isFetching}
        >
          {data.data.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
        <PagePagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.totalPages}
          totalItems={data.meta.totalItems}
          pageSize={limit}
          pageSizeOptions={WORKFLOW_PAGE_SIZE_OPTIONS}
          onPageChange={(nextPage) => void setParams({ page: nextPage })}
          onPageSizeChange={(nextLimit) => void setParams({ limit: nextLimit, page: 1 })}
          isDisabled={isFetching}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <WorkflowListFilters
        keyword={keyword}
        status={status}
        onKeywordChange={(next) => void setParams({ keyword: next.trim() || null, page: 1 })}
        onStatusChange={(next) => void setParams({ status: next, page: 1 })}
      />
      {renderContent()}
    </div>
  );
}

export { WorkflowList };
