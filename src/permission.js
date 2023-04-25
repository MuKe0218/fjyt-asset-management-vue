import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
// import { isRelogin } from '@/utils/request'

// 校验是否已登录
NProgress.configure({ showSpinner: false })

// 白名单，无需验证
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token */
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      // if (store.getters.roles.length === 0) {
      //   isRelogin.show = true
      //   // 判断当前用户是否已拉取完user_info信息
      //   store.dispatch('GetInfo').then(() => {
      //     isRelogin.show = false
      //     store.dispatch('GenerateRoutes').then(accessRoutes => {
      //       // 根据roles权限生成可访问的路由表
      //       // router.addRoutes(accessRoutes) // 动态添加可访问路由表
      //       // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      //       next()
      //     })
      //   }).catch(err => {
      //     store.dispatch('LogOut').then(() => {
      //       Message.error(err)
      //       next({ path: '/' })
      //     })
      //   })
      // } else {
      //   next()
      // }
      store.dispatch('GenerateRoutes').then(accessRoutes => {
        // 根据roles权限生成可访问的路由表
        for (let i = 0; i < accessRoutes.length; i++) {
          router.addRoute(accessRoutes[i])
        }
        console.log('添加路由成功')
        // router.addRoute(accessRoutes)
        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      })
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
