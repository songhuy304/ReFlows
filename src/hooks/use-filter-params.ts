import { createQueryParams, toQueryParams } from "@/lib/searchparams";
import { usePathname, useRouter } from "next/navigation";
import {
  inferParserType,
  useQueryStates,
  type Nullable,
  type UseQueryStatesKeysMap,
  type Values,
} from "nuqs";

interface UseFilterParamsOptions<TParsers extends UseQueryStatesKeysMap> {
  parsers: TParsers;
  defaultFilters?: Partial<inferParserType<TParsers>>;
}

export function useFilterParams<TParsers extends UseQueryStatesKeysMap>({
  parsers,
  defaultFilters,
}: UseFilterParamsOptions<TParsers>) {
  type TValues = inferParserType<TParsers>;
  const router = useRouter();
  const pathname = usePathname();

  const [params, setParams] = useQueryStates(parsers);

  const defaultValues = {
    ...defaultFilters,
    ...params,
  } as TValues;

  const handleSubmit = (values: TValues) => {
    void setParams({
      ...createQueryParams(values),
      page: 1,
    } as Partial<Nullable<Values<TParsers>>>);
  };
  const handleReset = (exclude: (keyof TParsers)[] = []) => {
    const cleared = Object.keys(parsers).reduce(
      (acc, key) => {
        if (!exclude.includes(key as keyof TParsers)) {
          acc[key] = null;
        }
        return acc;
      },
      {} as Record<string, null>
    );

    void setParams({
      ...cleared,
      ...toQueryParams(defaultFilters ?? {}),
      page: 1,
    } as Partial<Nullable<Values<TParsers>>>);
  };

  const handleClearFilters = () => {
    void router.push(pathname);
  };

  return {
    params,
    defaultValues,
    setParams,
    handleSubmit,
    handleReset,
    handleClearFilters,
  };
}
