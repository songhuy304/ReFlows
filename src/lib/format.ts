import dayjs from 'dayjs';

export const DEFAULT_DATE_FORMAT = 'DD-MM-YYYY';

export function formatDate(
  date?: dayjs.ConfigType,
  pattern = DEFAULT_DATE_FORMAT
): string {
  if (!date) return '';

  const d = dayjs(date);
  if (!d.isValid()) return '';

  return d.format(pattern);
}