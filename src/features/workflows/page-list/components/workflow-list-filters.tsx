"use client";

import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useState } from "react";
import { WORKFLOW_STATUSES } from "../../constants/workflow-status";
import type { WorkflowStatus } from "../../types";

const ALL_STATUSES = "all";
const SEARCH_DEBOUNCE_MS = 400;

interface WorkflowListFiltersProps {
  keyword: string;
  status: WorkflowStatus | null;
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: WorkflowStatus | null) => void;
}

function WorkflowListFilters({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
}: WorkflowListFiltersProps) {
  const [search, setSearch] = useState(keyword);
  const debouncedKeywordChange = useDebouncedCallback(onKeywordChange, SEARCH_DEBOUNCE_MS);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="w-full sm:max-w-xs">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            debouncedKeywordChange(event.target.value);
          }}
          placeholder="Search workflows..."
          aria-label="Search workflows"
          leftIcon={<Icons.search className="size-4" />}
        />
      </div>
      <Select
        value={status ?? ALL_STATUSES}
        onValueChange={(value) =>
          onStatusChange(value === ALL_STATUSES ? null : (value as WorkflowStatus))
        }
      >
        <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
          {WORKFLOW_STATUSES.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { WorkflowListFilters };
