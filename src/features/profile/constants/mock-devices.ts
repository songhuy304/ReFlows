import { Icons } from "@/components/icons";

import type { ActiveDevice } from "../types/active-device";

export const MOCK_ACTIVE_DEVICES: ActiveDevice[] = [
  {
    id: "1",
    name: 'MacBook Pro 16"',
    icon: Icons.laptop,
    os: "macOS Sonoma",
    browser: "Chrome",
    location: "Ho Chi Minh City, Vietnam",
    lastActive: "Just now",
    isCurrent: true,
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    icon: Icons.deviceMobile,
    os: "iOS 17",
    browser: "Safari",
    location: "Ho Chi Minh City, Vietnam",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
];
