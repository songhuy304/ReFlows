import { useSocket } from "@/components/layout/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  ENotificationType,
  INotificationRes,
  MemberJoinedTeamData,
  NOTIFICATION_EVENT,
} from "../types";
import { QUERY_KEY } from "@/config/query-keys";
import { invalidateQueries, invalidateQuery } from "@/lib/query-client";

const NotificationListener = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(NOTIFICATION_EVENT, onHandleNotification);
  }, [socket, queryClient]);

  const onHandleNotification = (notification: INotificationRes) => {
    invalidateQueries([
      QUERY_KEY.NOTIFICATION.LIST,
      QUERY_KEY.NOTIFICATION.UNREAD_COUNT,
    ]);

    switch (notification.type) {
      case ENotificationType.NEW_NOTIFICATION:
        toast.success("You have a new notification!");
        break;

      case ENotificationType.MEMBER_JOINED_TEAM:
        toast.info("A member has joined your team!");
        const data = notification.data as MemberJoinedTeamData;
        invalidateQueries([
          QUERY_KEY.TEAM.JOIN_REQUESTS(data.teamId),
          QUERY_KEY.TEAM.STATISTICS(data.teamId),
        ]);
        break;

      case ENotificationType.MEMBER_LEFT_TEAM:
        const dataLeft = notification.data as MemberJoinedTeamData;
        invalidateQueries([
          QUERY_KEY.TEAM.MEMBERS(dataLeft.teamId),
          QUERY_KEY.TEAM.STATISTICS(dataLeft.teamId),
        ]);
        break;

      default:
        break;
    }
  };

  return null;
};

export { NotificationListener };
