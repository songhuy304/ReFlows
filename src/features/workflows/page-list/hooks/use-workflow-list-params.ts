"use client";

import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { WORKFLOW_STATUS_VALUES } from "../../constants/workflow-status";
import type { WorkflowStatus } from "../../types";

export const WORKFLOW_PAGE_SIZE_OPTIONS = [12, 24, 48];

const MAX_PAGE_SIZE = 100;

const workflowListParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(WORKFLOW_PAGE_SIZE_OPTIONS[0]),
  keyword: parseAsString.withDefault(""),
  status: parseAsStringEnum<WorkflowStatus>(WORKFLOW_STATUS_VALUES),
};

export function useWorkflowListParams() {
  const [params, setParams] = useQueryStates(workflowListParsers);

  return {
    page: Math.max(params.page, 1),
    limit: Math.min(Math.max(params.limit, 1), MAX_PAGE_SIZE),
    keyword: params.keyword.trim(),
    status: params.status,
    setParams,
  };
}
