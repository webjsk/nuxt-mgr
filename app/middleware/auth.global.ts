// middleware/auth.global.ts

/** 从 Cookie 读取 accessToken，不依赖 Pinia 水合时机，避免刷新闪到 login */
function getTokenFromCookie(): string {
  const cookie = useCookie<string | null>('auth-token')
  const raw = cookie.value
  if (!raw) return ''
  try {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw
    return data?.state?.accessToken ?? data?.accessToken ?? ''
  } catch {
    return ''
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // 优先从 Cookie 判断 token，避免服务端/水合前 store 未恢复导致误跳 login
  const tokenFromCookie = getTokenFromCookie()
  const userStore = useUserStore()
  const hasToken = !!tokenFromCookie || !!userStore.accessToken

  if (hasToken) {
    if (to.path === '/login') {
      return navigateTo('/')
    }
    // 有 token 且访问非 /login：在 SSR 阶段补齐用户数据，利用 payload 机制保证客户端水合一致
    // await userStore.init()
    return
  }

  const whiteList = ['/login']
  if (whiteList.includes(to.path)) {
    return
  }

  return navigateTo({
    path: '/login',
    query: { redirect: to.fullPath },
  })
})