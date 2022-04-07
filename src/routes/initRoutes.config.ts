import type { RouteConfigType } from './interface';
import MenuIconMap from './MenuIconMap';
import { lazy } from 'react';

const initRoutes: RouteConfigType[] = [
  {
    path: '/user',
    name: '用户管理',
    icon: MenuIconMap['home'],
    children: [
      {
        path: '/',
        exact: true,
        redirect: '/user/edit',
      },
      {
        path: '/user/edit',
        name: '编辑',
        template: lazy(() => import('@/pages/User/Edit')),
      },
    ],
  },
  {
    path: '/zone',
    name: '专区管理',
    icon: MenuIconMap['home'],
    children: [
      {
        path: '/zone',
        exact: true,
        redirect: '/zone/edit',
      },
      {
        path: '/zone/edit',
        name: '编辑',
        template: lazy(() => import('@/pages/Zone/Edit')),
      },
    ],
  },
  {
    path: '/study-route',
    name: '学习路线管理',
    icon: MenuIconMap['home'],
    children: [
      {
        path: '/study-route',
        exact: true,
        redirect: '/study-route/apply',
      },
      {
        path: '/study-route/apply',
        name: '学习路线审核',
        template: lazy(() => import('@/pages/StudyRoute/Apply')),
      },
      {
        path: '/study-route/edit',
        name: '学习路线编辑',
        template: lazy(() => import('@/pages/StudyRoute/Edit')),
      },
    ],
  },
  {
    path: '/study-set',
    name: '学库管理',
    icon: MenuIconMap['home'],
    children: [
      {
        path: '/study-set',
        exact: true,
        redirect: '/study-set/apply',
      },
      {
        path: '/study-set/apply',
        name: '学库审核',
        template: lazy(() => import('@/pages/StudySet/Apply')),
      },
      {
        path: '/study-set/edit',
        name: '学库编辑',
        template: lazy(() => import('@/pages/StudySet/Edit')),
      },
      // {
      //   path: '/report/data',
      //   name: '举报数据统计',
      //   template: lazy(() => import('@/pages/DataReport')),
      //   exact: true,
      // },
      // {
      //   path: '/report/data/plate/:id',
      //   name: '举报数据统计-话题详情',
      //   hideInMenu: true,
      //   template: lazy(() => import('@/pages/PlateDetail')),
      // },
    ],
  },
  {
    path: '/study-item',
    name: '学点管理',
    icon: MenuIconMap['home'],
    children: [
      {
        path: '/study-item',
        exact: true,
        redirect: '/study-item/apply',
      },
      {
        path: '/study-item/apply',
        name: '学点审核',
        template: lazy(() => import('@/pages/StudyItem/Apply')),
      },
      {
        path: '/study-item/edit',
        name: '学点编辑',
        template: lazy(() => import('@/pages/StudyItem/Edit')),
      },
    ],
  },
  {
    path: '/discuss',
    name: '评论管理',
    icon: MenuIconMap['home'],
    children: [
      {
        path: '/discuss',
        exact: true,
        redirect: '/discuss/edit',
      },
      {
        path: '/discuss/edit',
        name: '编辑',
        template: lazy(() => import('@/pages/Discuss/Edit')),
      },
    ],
  },
  {
    path: '/provider',
    name: '贡献者管理',
    icon: MenuIconMap['home'],
    children: [
      {
        path: '/provider',
        exact: true,
        redirect: '/provider/apply',
      },
      {
        path: '/provider/apply',
        name: '审核',
        template: lazy(() => import('@/pages/Provider/Apply')),
      },
    ],
  },
];

export default initRoutes;
