"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { NotificationCard } from "@/components/ui/notification-card";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslations } from "next-intl";
import {
  useGetInfiniteNotifications,
  useGetUnreadCount,
  useMarkAllAsRead,
  useMarkAsRead,
} from "../hooks";
import { mapApiNotification } from "../utils/map-notification";

const PAGE_SIZE = 5;

const actionRoutes: Record<string, string> = {
  view: "/dashboard/workspaces",
  "view-product": "/dashboard/product",
  billing: "/dashboard/billing",
  open: "/dashboard/kanban",
  "open-chat": "/dashboard/chat",
};

export function NotificationCenter() {
  const t = useTranslations();
  const {
    data: notificationsRes,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteNotifications({ limit: PAGE_SIZE });
  const { data: unreadCountRes } = useGetUnreadCount();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const router = useRouter();

  const count = unreadCountRes?.data?.count ?? 0;
  const apiNotifications = notificationsRes?.pages.flatMap((page) => page.data) ?? [];
  const notifications = apiNotifications.map(mapApiNotification);

  const handleMarkAsRead = (id: string) => {
    markAsRead(Number(id));
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Icons.notification className="h-4 w-4" />
          {count > 0 && (
            <span className="text-white bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium">
              {count > 9 ? "9+" : count}
            </span>
          )}
          <span className="sr-only">{t("Notifications.title")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[calc(100vw-2rem)] p-0 sm:w-[380px]"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h4 className="text-sm font-semibold group-hover:underline">
            {t("Notifications.title")}
          </h4>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-auto px-2 py-1 text-xs"
                onClick={handleMarkAllAsRead}
              >
                {t("Notifications.mark-all-as-read")}
              </Button>
            )}
          </div>
        </div>
        <Separator />
        <div id="notification-scroll-container" className="h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icons.spinner className="text-muted-foreground/40 mb-2 h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">{t("Common.loading")}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icons.notification className="text-muted-foreground/40 mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                {t("Notifications.no-notifications")}
              </p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={notifications.length}
              next={fetchNextPage}
              hasMore={Boolean(hasNextPage)}
              loader={
                <div className="flex items-center justify-center px-4 py-3">
                  <Icons.spinner className="text-muted-foreground h-4 w-4 animate-spin" />
                </div>
              }
              scrollableTarget="notification-scroll-container"
              className="flex flex-col gap-1 p-2"
              endMessage={
                notifications.length > PAGE_SIZE ? (
                  <p className="text-muted-foreground px-2 py-3 text-center text-xs">
                    {t("Notifications.reached-end")}
                  </p>
                ) : undefined
              }
            >
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  id={notification.id}
                  title={notification.title}
                  body={notification.body}
                  status={notification.status}
                  createdAt={notification.createdAt}
                  onMarkAsRead={handleMarkAsRead}
                  onAction={(notifId, actionId) => {
                    const route = actionRoutes[actionId];
                    if (route) {
                      handleMarkAsRead(notifId);
                      router.push(route);
                    }
                  }}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
