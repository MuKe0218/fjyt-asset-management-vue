import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Layout from '@/layout'

Vue.use(Router)

// 公共路由
export const constantRoutes = [
//   {
//     path: '/index',
//     name: 'Index',
//     component: () => import('@/views/index')
//   },
  {
    path: '',
    name: 'Layout',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login')
  }
]
// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
