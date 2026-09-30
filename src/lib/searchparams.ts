import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  role: parseAsString,
  sort: parseAsString,
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

type QueryValue = string | number | boolean | null | undefined | readonly unknown[];

const isEmptyValue = (value: QueryValue) => {
  if (value == null) return true; // null | undefined

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};
export function createQueryParams<T extends Record<string, any>>(
  values: T
): { [K in keyof T]: T[K] | null } {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      isEmptyValue(value as QueryValue) ? null : value,
    ])
  ) as { [K in keyof T]: T[K] | null };
}
export function toQueryParams<T extends Record<string, any>>(
  values: T
): Partial<Record<keyof T, any>> {
  return Object.entries(values).reduce(
    (acc, [key, value]) => {
      const isEmpty =
        value == null || value === "" || (Array.isArray(value) && value.length === 0);

      acc[key as keyof T] = isEmpty ? null : value;

      return acc;
    },
    {} as Partial<Record<keyof T, any>>
  );
}
export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
