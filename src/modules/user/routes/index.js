import { lazy } from "react"

export const Routes = [
  {
    path: "/login",
    component: lazy(() => import("../views/auth/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true
    }
  },
  // {
  //   path: "/register",
  //   component: lazy(() => import("../views/auth/Register")),
  //   layout: "BlankLayout",
  //   meta: {
  //     authRoute: true
  //   }
  // },
  // {
  //   path: "/forgot-password",
  //   component: lazy(() => import("../views/auth/ForgotPassword")),
  //   layout: "BlankLayout",
  //   meta: {
  //     authRoute: true
  //   }
  // },
  // {
  //   path: "/reset-password/:email",
  //   component: lazy(() => import("../views/auth/ResetPassword")),
  //   layout: "BlankLayout",
  //   meta: {
  //     authRoute: true
  //   }
  // },
  // {
  //   path: "/user/account-settings",
  //   component: lazy(() => import("../views/account-settings")),
  //   meta: {
  //     action: "call",
  //     resource: "NoPermissionCode"
  //   }
  // },
  {
    path: "/dashboard",
    component: lazy(() => import("../views/dashboard")),
    meta: {
      general: true
    }
  },
  {
    path: "/privacy",
    component: lazy(() => import("../views/privacy")),
    layout: "BlankLayout",
    meta: {
      publicRoute:true
    }
  },
  {
    path: "/support",
    component: lazy(() => import("../views/support")),
    layout: "BlankLayout",
    meta: {
      publicRoute:true
    }
  },
  {
    path: "/admin/list",
    component: lazy(() => import("../views/admin-list")),
    meta: {
      action: "call",
      resource: "ADMINS_VIEW_LIST"
    }
  },
  {
    path: "/teams/list",
    component: lazy(() => import("../views/responsibles/responsibles-list")),
    meta: {
      action: "call",
      resource: "TEAMS_VIEW_LIST"
    }
  },
  {
    path: '/teams/:id',
    component: lazy(() => import('../views/responsibles/responsible-profile')),
    meta: {
      action: "call",
      resource: "TEAMS_VIEW_PROFILE"
      // navLink: '/teams'
    }
  },
  // {
  //   path: "/elections/list",
  //   component: lazy(() => import("../views/elections/elections-list")),
  //   meta: {
  //     action: "call",
  //     resource: "ELECTIONS_VIEW_LIST"
  //   }
  // },
  // {
  //   path: "/elections/:id",
  //   component: lazy(() => import("../views/elections/election-view")),
  //   meta: {
  //     action: "call",
  //     resource: "ELECTIONS_VIEW_ELECTION"
  //   }
  // },
  // {
  //   path: "/box/:id",
  //   component: lazy(() => import("../views/elections/election-view/box-view")),
  //   meta: {
  //     action: "call",
  //     resource: "ELECTIONS_VIEW_BOX"
  //   }
  // },
  // {
  //   path: "/citizens/list",
  //   component: lazy(() => import("../views/citizens/citizens-list")),
  //   meta: {
  //     action: "call",
  //     resource: "CITIZENS_VIEW_LIST"
  //   }
  // },
  // {
  //   path: "/citizens/:id",
  //   component: lazy(() => import("../views/citizens/citizen-profile")),
  //   meta: {
  //     action: "call",
  //     resource: "CITIZENS_VIEW_CITIZEN"
  //   }
  // },
  {
    path: "/projects/list",
    component: lazy(() => import("../views/projects/projects-list")),
    meta: {
      action: "call",
      resource: "PROJECTS_VIEW_LIST"
    }
  },
  {
    path: "/projects/:id",
    component: lazy(() => import("../views/projects/project-view")),
    meta: {
      action: "call",
      resource: "PROJECTS_VIEW_PROJECT"
    }
  },
  // {
  //   path: "/notifications/list",
  //   component: lazy(() => import("../views/notifications/notifications-list")),
  //   meta: {
  //     action: "call",
  //     resource: "NOTIFICATIONS_VIEW_LIST"
  //   }
  // },
  // {
  //   path: "/notifications/send",
  //   component: lazy(() => import("../views/notifications/notifications-list/SendNotification.js")),
  //   meta: {
  //     action: "call",
  //     resource: "NOTIFICATIONS_SEND_NOTIFICATION"
  //   }
  // },
  // {
  //   path: "/livestream",
  //   component: lazy(() => import("../views/livestream")),
  //   meta: {
  //     action: "call",
  //     resource: "ELECTIONS_VIEW_LIVESTREAM"
  //   }
  // },
  {
    path: "/settings",
    component: lazy(() => import("../views/settings")),
    meta: {
      action: "call",
      resource: "SETTINGS_VIEW_SETTINGS"
    }
  },
  {
    path: "/roles/list",
    component: lazy(() => import("../views/roles-permissions/roles")),
    meta: {
      action: "call",
      resource: "ROLES_VIEW_LIST"
    }
  }
]
