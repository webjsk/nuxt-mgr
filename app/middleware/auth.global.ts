// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
    // 仅在客户端执行
    // if (import.meta.server) return
  
    const userStore = useUserStore()
  
    // 白名单路由（不需要登录）
    const whiteList = ['/login']
  
    // 如果是白名单路由，直接放行
    if (whiteList.includes(to.path)) {
      // 如果已登录，重定向到首页
      if (userStore.isLoggedIn) {
        return navigateTo('/')
      }
      return
    }
  
    // 如果未登录，重定向到登录页
    if (!userStore.isLoggedIn) {
      return navigateTo({
        path: '/login',
        query: {
          redirect: to.fullPath, // 记录重定向地址
        },
      })
    }
  })