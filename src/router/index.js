import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout/index';
Vue.use(VueRouter);
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('@/views/login/index'),
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    // redirect: '/device',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/index/index'),
    hidden: true,
    meta: { title: '监控中心', icon: 'screen-active' },
  },
  // {
  //   path: '/role',
  //   component: Layout,
  //   redirect: '/role/list',
  //   name: 'RoleManage',
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/role/list/index'),
  //       name: 'RoleList',
  //       meta: {
  //         title: '角色管理',
  //         icon: 'nav-auth',
  //       },
  //     },
  //     {
  //       path: 'add',
  //       component: () => import('@/views/role/add/index'),
  //       name: 'AddRole',
  //       meta: { title: '添加角色' },
  //       hidden: true,
  //     },
  //     {
  //       path: 'detail/:id(\\d+)?',
  //       component: () => import('@/views/role/edit/index'),
  //       name: 'DetailRole',
  //       meta: { title: '角色详情' },
  //       hidden: true,
  //     },
  //   ],
  // },
];

export const asyncRoutes = [
  {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    name: 'Device',
    meta: {
      title: '设备管理',
      icon: 'nav-device',
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/device/list/index'),
        name: 'DeviceList',
        meta: { title: '设备列表' },
      },
      {
        path: 'product',
        component: () => import('@/views/device/product/index'),
        name: 'ProductManage',
        meta: { title: '产品管理' },
      },
      {
        path: 'group',
        component: () => import('@/views/device/group/index'),
        name: 'GroupManage',
        meta: { title: '分组管理' },
      },
    ],
  },
  {
    path: '/fault',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/fault/index'),
        name: 'FaultManage',
        meta: { title: '告警管理', icon: 'nav-fault' },
      },
    ],
  },
  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/project/index'),
        name: 'ProjectManage',
        meta: { title: '项目管理', icon: 'nav-proj' },
      },
    ],
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'UserManage',
        meta: { title: '用户管理', icon: 'nav-user' },
      },
    ],
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role/list',
    name: 'RoleManage',
    children: [
      {
        path: 'list',
        component: () => import('@/views/role/list/index'),
        name: 'RoleList',
        meta: {
          title: '角色管理',
          icon: 'nav-auth',
        },
      },
      {
        path: 'add',
        component: () => import('@/views/role/add/index'),
        name: 'AddRole',
        meta: { title: '添加角色' },
        hidden: true,
      },
      {
        path: 'detail/:id(\\d+)?',
        component: () => import('@/views/role/edit/index'),
        name: 'DetailRole',
        meta: { title: '角色详情' },
        hidden: true,
      },
    ],
  },
  // {
  //   path: '/auth',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/auth/index'),
  //       name: 'AuthManage',
  //       meta: { title: '权限管理', icon: 'nav-auth' },
  //     },
  //   ],
  // },
  {
    path: '/platform',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/platform/index'),
        name: 'Platform',
        meta: { title: '平台管理', icon: 'nav-platform' },
      },
    ],
  },
];
const createRouter = () =>
  new VueRouter({
    mode: 'hash',
    routes: constantRoutes,
    scrollBehavior: () => ({ y: 0 }), // 页面滚动的位置
  });

const router = createRouter();

export default router;
