import { createParser } from 'nuqs/server';
import { z } from 'zod';
import dayjs from 'dayjs';
import type { DateRange } from 'react-day-picker';

import { dataTableConfig } from '@/config/data-table';

import type { ExtendedColumnFilter, ExtendedColumnSort } from '@/types/data-table';

/**
 * Serializes a `DateRange` into a URL param as comma-separated unix seconds
 * (e.g. `1212412540,1231231240`) and parses it back into `Date` objects.
 * Either bound may be absent (e.g. `1212412540,` or `,1231231240`).
 */
export const parseAsDateRange = createParser<DateRange>({
  parse: (query) => {
    const [fromRaw, toRaw] = query.split(',');

    const parseBound = (raw?: string): Date | undefined => {
      if (!raw) return undefined;
      const unix = Number(raw);
      if (!Number.isFinite(unix)) return undefined;
      const date = dayjs.unix(unix);
      return date.isValid() ? date.toDate() : undefined;
    };

    const from = parseBound(fromRaw);
    const to = parseBound(toRaw);

    if (!from && !to) return null;

    return { from, to };
  },
  serialize: (range) => {
    const from = range?.from ? dayjs(range.from).unix() : '';
    const to = range?.to ? dayjs(range.to).unix() : '';

    if (from === '' && to === '') return '';

    return `${from},${to}`;
  },
  eq: (a, b) => a.from?.getTime() === b.from?.getTime() && a.to?.getTime() === b.to?.getTime()
});

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean()
});

export const getSortingStateParser = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every((item, index) => item.id === b[index]?.id && item.desc === b[index]?.desc)
  });
};

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string()
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

export const getFiltersStateParser = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(filterItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnFilter<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id &&
          filter.value === b[index]?.value &&
          filter.variant === b[index]?.variant &&
          filter.operator === b[index]?.operator
      )
  });
};
