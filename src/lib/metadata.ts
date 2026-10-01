import { APP_NAME } from "@/config/app.config";
import type { Metadata } from "next";

export function createMetadata(
  title: string,
  description?: string,
  meta?: Metadata
): Metadata {
  return {
    title: `${title ? `${title} | ` : ""}${APP_NAME}`,
    description,
    ...meta,
  };
}
