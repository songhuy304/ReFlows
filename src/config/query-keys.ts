export const QUERY_KEY = {
  AUTH: {
    ME: ["auth", "me"],
  },

  USER: {
    ROOT: "user",
    INFO: ["user", "info"],
    LIST: ["user", "list"],
  },

  TEAM: {
    ROOT: "team",
    INFO: ["team", "info"],
    LIST: ["team", "list"],
    STATISTICS: (id: number) => ["team", "statistics", id],
    MEMBERS: (id: number) => ["team", "members", id],
    JOIN_REQUESTS: (id: number) => ["team", "join-requests", id],
  },

  NOTIFICATION: {
    ROOT: "notification",
    LIST: ["notification", "list"],
    UNREAD_COUNT: ["notification", "unread-count"],
  },

  LOCATION: {
    LIST: ["location", "list"],
  },

  DEPARTMENT: {
    LIST: ["department", "list"],
  },

  JOB: {
    ROOT: "job",
    INFO: ["job", "info"],
    LIST: ["job", "list"],
    DETAIL: (id: number) => ["job", "detail", id],
  },

  WORKFLOW: {
    ROOT: "workflow",
    LIST: ["workflow", "list"],
    DETAIL: (id: number | string) => ["workflow", "detail", String(id)],
  },
} as const;
