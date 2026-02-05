// stores/user.ts
import type { User, LoginResult } from '@/types/user'
import { Logout } from '@/api/login'
import type { GetPermissionInfoResult, Menu, Permission, Roles, UserInfoFromApi } from '@/api/user/type'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref<string>('')
  const refreshToken = ref<string>('')
  const tenantId = ref<string | number>('')
  const expiresTime = ref<number | undefined>(undefined)
  // local storage
  const userInfo = ref<UserInfoFromApi | null>(null)
  /** 左侧菜单（来自 get-permission-info 或默认配置） */
  const menus = ref<Menu[]>([])
  /** 权限标识列表 */
  const permissions = ref<Permission>([])
  /** 角色标识列表 */
  const roles = ref<Roles>([])
  const isLoggedIn = computed(() => !!accessToken.value)
  // const username = computed(() => userInfo.value?.username ?? '')
  // const nickname = computed(() => userInfo.value?.nickname ?? '')
  // const avatar = computed(() => userInfo.value?.avatar ?? '')

  // --- Actions ---

  /**
   * 你期望的“有值”判定：
   * - userInfo：非 null
   * - menus / permissions / roles：数组且至少 1 项
   */
  const isUserDataReady = () => {
    const okUser = !!userInfo.value
    const okMenus = Array.isArray(menus.value) && menus.value.length > 0
    const okPerms = Array.isArray(permissions.value) && permissions.value.length > 0
    const okRoles = Array.isArray(roles.value) && roles.value.length > 0
    return okUser && okMenus && okPerms && okRoles
  }

  /**
   * 拉取当前用户信息与权限
   * 规范：该方法将被插件在服务端(SSR)调用
   */
  const getUserInfo = async () => {
    try {
      // 用 useFetch（payload 水合）：SSR 请求一次，CSR 复用服务端 payload，避免重复请求
      const { data, error } = await useApiData<GetPermissionInfoResult>(
        '/system/auth/get-permission-info',
        {
          method: 'GET',
          server: true,
          key: 'user-permission-info',
        }
      )
      if (error.value) throw error.value
      const res = data.value as GetPermissionInfoResult | null
      if (!res) return
      userInfo.value = res?.user as UserInfoFromApi
      menus.value = res?.menus?.length ? res.menus : []
      permissions.value = res?.permissions ?? []
      roles.value = res?.roles ?? []
    } catch (error) {
      // 如果是服务端报错，通常是 Token 失效
      menus.value = []
    }
  }

  const logout = async () => {
    try {
      await Logout()
    } catch {
      // 忽略接口失败，仍清除本地状态
    } finally {
      accessToken.value = ''
      refreshToken.value = ''
      userInfo.value = null
      tenantId.value = ''
      expiresTime.value = undefined
      menus.value = []
      permissions.value = []
      roles.value = []
      useAppStore().closeAllTabs()
      navigateTo('/login')
    }
  }

  /**
   * 登录成功：存储接口返回的 accessToken、refreshToken 等（由登录页验证码通过后调用）
   * @param tid 租户编号，启用租户模式时在请求头中携带
   */
  const setLoginResult = (result: LoginResult, _rememberMe = false, tid?: number) => {
    accessToken.value = result.accessToken
    refreshToken.value = result.refreshToken ?? ''
    expiresTime.value = result.expiresTime
    if (tid !== undefined) {
      tenantId.value = tid
    }
    // accessToken、refreshToken 由 pinia-plugin-persistedstate 持久化
  }

  /**
   * ✅ 初始化（SSR + CSR）
   */
  const init = async () => {
    // Nuxt 内部会自动处理 SSR 还是 CSR
    const authToken = useCookie('auth-token').value
    if (authToken) {
      try {
        const tokenData = typeof authToken === 'string' ? JSON.parse(authToken) : authToken
        // 兼容插件格式 { state: { accessToken, ... } } 或平铺 { accessToken, ... }
        const state = tokenData?.state ?? tokenData
        // 仅在 cookie 提供字段时覆盖，避免把现有 store 值覆盖成空
        accessToken.value = state.accessToken ?? accessToken.value
        refreshToken.value = state.refreshToken ?? refreshToken.value
        expiresTime.value = state.expiresTime ?? expiresTime.value
        tenantId.value = state.tenantId ?? tenantId.value
      } catch (e) {
        console.error('解析 Cookie 失败:', e)
      }
    }

    // 只要有 token 且用户数据不完整，就重新请求一次：
    // - SSR：保证首屏有 userInfo/menus/permissions/roles，客户端水合一致
    // - CSR：当本地存储里被写成了 [] / null 等“脏数据”时，自动修复并重新拉取
    if (accessToken.value && !isUserDataReady()) {
      await getUserInfo()
    }
  }
  return {
    accessToken,
    refreshToken,
    userInfo,
    tenantId,
    menus,
    permissions,
    roles,
    isLoggedIn,
    // username,
    // nickname,
    // avatar,
    logout,
    getUserInfo,
    // init,
    setLoginResult,
    init,
  }
}, {
  // persist: true,
  // ✅ 持久化配置
  persist: import.meta.client ? [
    {
      key: 'auth-token',
      storage: persistedState.cookiesWithOptions({
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 天
      }),
      paths: ['accessToken', 'refreshToken',"tenantId","expiresTime"], // ✅ 只存储 token
    },
    {
      key: 'user-data',
      storage: persistedState.localStorage,
      paths: ['userInfo', 'menus', 'permissions', 'roles'], // ✅ 用户信息存储到 localStorage
    },
  ] : false, // ✅ 只在客户端启用持久化
})