export const routesList = [
  {
    id: "main-pages",
    title: "Main pages",
    url: "#",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        url: "/",
        active: false,
      },
      {
        id: "jobs",
        title: "Jobs list",
        url: "/jobs",
        active: false,
      },
    ],
  },
  {
    id: "setting-pages",
    title: "System settings",
    url: "#",
    items: [
      {
        id: "db_backups",
        title: "Databases & Backups",
        url: "/db_backups",
      },
      {
        id: "proxies",
        title: "Proxies",
        url: "/proxies",
      },
      {
        id: "configs",
        title: "Configs",
        url: "/configs",
      },
      {
        id: "notificationsServices",
        title: "Notifications",
        url: "/notifications",
      },
      {
        id: "eventLog",
        title: "Event Log",
        url: "/eventLog",
      },
      {
        id: "jobEvents",
        title: "Job Events",
        url: "/jobEvents",
      },
    ],
  },
  {
    id: "auth-section",
    title: "Authentication",
    url: "#",
    items: [
      {
        id: "apiKeys",
        title: "API Keys",
        url: "/apiKeys",
      },
    ],
  },
]
