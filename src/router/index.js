import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// 公共路由
export const constantRoutes = [
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/index')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login')
  }
]
export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
