import { ETEAM_ROLE } from "@/enums/app.enum";

export const TEAM_ROLE_OPTIONS = [
  { value: ETEAM_ROLE.OWNER, label: "Owner" },
  { value: ETEAM_ROLE.MEMBER, label: "Member" },
  { value: ETEAM_ROLE.ADMIN, label: "Admin" },
];

export const USER_ROLE_OPTIONS = [
  { value: "owner", label: "OWNER" },
  { value: "admin", label: "ADMIN" },
  { value: "member", label: "MEMBER" },
];

export function getTeamRoleLabel(role: ETEAM_ROLE) {
  switch (role) {
    case ETEAM_ROLE.OWNER:
      return "Owner";
    case ETEAM_ROLE.MEMBER:
      return "Member";
    case ETEAM_ROLE.ADMIN:
      return "Admin";
  }
}
