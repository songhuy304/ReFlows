import { useCallback, useState } from "react";
import { QueryKey, UseQueryResult, useQuery } from "@tanstack/react-query";

export default function useLazyQuery<TVariables, TData, TError = Error>(
  queryKey: (variables: TVariables) => QueryKey,
  queryFn: (variables: TVariables) => Promise<TData>,
): readonly [(variables: TVariables) => void, UseQueryResult<TData, TError>] {
  const [variables, setVariables] = useState<TVariables>();

  const query = useQuery<TData, TError>({
    queryKey: variables ? queryKey(variables) : ["lazy-query"],
    queryFn: () => queryFn(variables as TVariables),
    enabled: variables !== undefined,
  });

  const trigger = useCallback((variables: TVariables) => {
    setVariables(variables);
  }, []);

  return [trigger, query] as const;
}
