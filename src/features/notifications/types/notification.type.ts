export const NOTIFICATION_EVENT = "NOTIFICATION";

export enum ENotificationType {
  NEW_NOTIFICATION = "NEW_NOTIFICATION",
  INVITED_TO_TEAM = "INVITED_TO_TEAM",
  JOINED_TEAM = "JOINED_TEAM",
  LEFT_TEAM = "LEFT_TEAM",

  MEMBER_JOINED_TEAM = "MEMBER_JOINED_TEAM",
  MEMBER_LEFT_TEAM = "MEMBER_LEFT_TEAM",
  TEAM_INVITE = "TEAM_INVITE",
}

export interface INotificationRes<T = unknown> {
  type: ENotificationType;
  data: T;
}

export interface MemberJoinedTeamData {
  teamId: number;
}

export interface INotification {
  id: number;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  userId: number;
  createdAt?: string;
}

export interface IGetNotificationsParams {
  page: number;
  limit: number;
}

export interface ICountUnread {
  count: number;
}
