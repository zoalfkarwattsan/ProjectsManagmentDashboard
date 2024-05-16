import React from "react"
import {Bell, Briefcase, Shield, Home, Lock, Settings, User, Users, UserCheck} from "react-feather"

import {trans} from '@utils'

export const Navigation = [
  {
    id: 'dashboard',
    title: trans('user.nav.dashboard'),
    icon: <Home size={20}/>,
    navLink: '/dashboard',
    action: 'call',
    resource: 'general'
  },
  {
    id: 'adminList',
    title: trans('user.nav.adminList'),
    icon: <Lock />,
    navLink: '/admin/list',
    action: 'call',
    resource: 'ADMINS_VIEW_LIST'
  },
  {
    id: 'teams',
    title: trans('user.nav.teams'),
    icon: <User />,
    navLink: '/teams/list',
    action: 'call',
    resource: 'TEAMS_VIEW_LIST'
  },
  // {
  //   id: 'Elections',
  //   title: trans('user.nav.elections'),
  //   icon: <UserCheck />,
  //   navLink: '/elections/list',
  //   action: 'call',
  //   resource: 'ELECTIONS_VIEW_LIST'
  // },
  // {
  //   id: 'Citizens',
  //   title: trans('user.nav.citizens'),
  //   icon: <Users />,
  //   navLink: '/citizens/list',
  //   action: 'call',
  //   resource: 'CITIZENS_VIEW_LIST'
  // },
  {
    id: 'Projects',
    title: trans('user.nav.projects'),
    icon: <Briefcase />,
    navLink: '/projects/list',
    action: 'call',
    resource: 'PROJECTS_VIEW_LIST'
  },
  // {
  //   id: 'Notifications',
  //   title: trans('user.nav.notifications'),
  //   icon: <Bell />,
  //   navLink: '/notifications/list',
  //   action: 'call',
  //   resource: 'NOTIFICATIONS_VIEW_LIST'
  // },
  // {
  //   id: 'Stream',
  //   title: trans('user.nav.liveStream'),
  //   icon: <User size={12} />,
  //   navLink: '/livestream',
  //   action: 'call',
  //   resource: 'ELECTIONS_VIEW_LIVESTREAM'
  // },
  {
    id: 'Roles&Permissions',
    title: trans('user.nav.rolesPermissions'),
    icon: <Shield />,
    navLink: '/roles/list',
    action: 'call',
    resource: 'ROLES_VIEW_LIST'
  },
  {
    id: 'Settings',
    title: trans('user.nav.settings'),
    icon: <Settings />,
    navLink: '/settings',
    action: 'call',
    resource: 'SETTINGS_VIEW_SETTINGS'
  }
]
