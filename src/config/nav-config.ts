import { NavGroup } from "@/types";
import { PATHS } from "./paths.config";

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: PATHS.DASHBOARD,
        icon: "dashboard",
        isActive: false,
        shortcut: ["d", "d"],
        items: [],
      },
      {
        title: "Workflows",
        url: PATHS.WORKFLOWS,
        icon: "adjustments",
        shortcut: ["w", "w"],
        isActive: false,
        items: [],
      },
    ],
  },
];
