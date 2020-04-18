import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/index'
Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import('@/views/login/index')
  },
  {
    path: "/",
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: { title: '监控中心' }
      }
    ]
  }
]

const createRouter = () => new VueRouter({
  mode: 'hash',
  routes: constantRoutes,
  scrollBehavior: () => ({ y: 0 }) // 页面滚动的位置
})

const router = createRouter();

export default router