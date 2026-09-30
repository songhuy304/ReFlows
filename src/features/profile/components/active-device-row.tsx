"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import type { ActiveDevice } from "../types/active-device";

interface ActiveDeviceRowProps {
  device: ActiveDevice;
  className?: string;
}

export function ActiveDeviceRow({ device, className }: ActiveDeviceRowProps) {
  const DeviceIcon = device.icon;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 gap-4">
        <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
          <DeviceIcon className="text-muted-foreground size-5" />
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Typography as="p" variant="label-sm">
              {device.name}
            </Typography>
            {device.isCurrent && (
              <Badge variant="default">Current device</Badge>
            )}
          </div>

          <Typography
            as="p"
            variant="paragraph-xs"
            className="text-muted-foreground"
          >
            {device.os} · {device.browser}
          </Typography>
          <Typography
            as="p"
            variant="paragraph-xs"
            className="text-muted-foreground"
          >
            {device.location}
          </Typography>
          <Typography
            as="p"
            variant="paragraph-xs"
            className="text-muted-foreground"
          >
            Last active: {device.lastActive}
          </Typography>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        {device.isCurrent ? (
          <Button type="button" variant="outline" size="sm">
            Log out all other devices
          </Button>
        ) : (
          <>
            <Button type="button" variant="outline" size="sm">
              Log out
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon">
                  <Icons.ellipsis className="size-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Rename device</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Remove device
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
}
