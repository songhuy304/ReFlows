import type { TFunction } from "@/i18n/config";

const FALLBACK_ERROR_KEY = "error.internal-server";

function extractErrorKey(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("message" in error)) {
    return undefined;
  }

  const { message } = error as { message: unknown };
  if (Array.isArray(message)) {
    return typeof message[0] === "string" ? message[0] : undefined;
  }

  return typeof message === "string" ? message : undefined;
}

export function getApiErrorMessage(error: unknown, t: TFunction): string {
  const key = extractErrorKey(error) ?? FALLBACK_ERROR_KEY;
  return t.has(key) ? t(key) : key;
}
