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
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import ('@/views/project/index'),
        name: 'Project',
        meta: {title: '项目管理', icon: 'nav-proj'},
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
        name: 'Fault',
        meta: {title: '告警管理', icon: 'nav-fault'},
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
        name: 'User',
        meta: {title: '用户管理', icon: 'nav-user'},
      },
    ],
  },
  {
    path: '/auth',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import ('@/views/auth/index'),
        name: 'Auth',
        meta: {title: '权限管理', icon: 'nav-auth'},
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
