import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout/index';
Vue.use (VueRouter);
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import ('@/views/login/index'),
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import ('@/views/index/index'),
    hidden: true,
    meta: {title: '监控中心', icon: 'screen-active'},
  },
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
        component: () => import ('@/views/device/list/index'),
        name: 'DeviceList',
        meta: {title: '设备列表'},
      },
      {
        path: 'product',
        component: () => import ('@/views/device/product/index'),
        name: 'ProductManage',
        meta: {title: '产品管理'},
      },
      {
        path: 'group',
        component: () => import ('@/views/device/group/index'),
        name: 'GroupManage',
        meta: {title: '分组管理'},
      },
    ],
  },
  {
    path: '/fault',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import ('@/views/fault/index'),
        name: 'FaultManage',
        meta: {title: '告警管理', icon: 'nav-fault'},
      },
    ],
  },
  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import ('@/views/project/index'),
        name: 'ProjectManage',
        meta: {title: '项目管理', icon: 'nav-proj'},
      },
    ],
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import ('@/views/user/index'),
        name: 'UserManage',
        meta: {title: '用户管理', icon: 'nav-user'},
      },
    ],
  },
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/list',
    name: 'Auth',
    meta: {
      title: '权限管理',
      icon: 'nav-auth',
    },
    children: [
      {
        path: 'list',
        component: () => import ('@/views/auth/list/index'),
        name: 'AuthList',
        meta: {title: '权限列表'},
      },
      {
        path: 'add',
        component: () => import ('@/views/auth/add/index'),
        name: 'AddAuth',
        meta: {title: '添加权限'},
        hidden: true,
      },
      {
        path: 'detail/:id(\\d+)?',
        component: () => import ('@/views/auth/edit/index'),
        name: 'DetailAuth',
        meta: {title: '权限详情'},
        hidden: true,
      },
    ],
  },
  {
    path: '/platform',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import ('@/views/platform/index'),
        name: 'Platform',
        meta: {title: '平台管理', icon: 'nav-platform'},
      },
    ],
  },
];

const createRouter = () =>
  new VueRouter ({
    mode: 'hash',
    routes: constantRoutes,
    scrollBehavior: () => ({y: 0}), // 页面滚动的位置
  });

const router = createRouter ();

export default router;
