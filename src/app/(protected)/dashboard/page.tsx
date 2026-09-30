import { createMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = createMetadata("Dashboard", "Dashboard page.");

export default async function Dashboard() {
  redirect("/dashboard/overview");
}
