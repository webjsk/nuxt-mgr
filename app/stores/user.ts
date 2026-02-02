// stores/user.ts
import type { User, LoginResult } from '@/types/user'
import { GetInfo, Logout } from '@/api/login'
import type { GetPermissionInfoResult, Menu, Permission, Roles } from '@/api/user/type'
import { defaultMenus } from '@/constants/menu'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref<string>('')
  const refreshToken = ref<string>('')
  const userInfo = ref<User | null>(null)
  const tenantId = ref<string | number>('')
  const expiresTime = ref<number | undefined>(undefined)
  /** 左侧菜单（来自 get-permission-info 或默认配置） */
  const menus = ref<Menu[]>([])
  /** 权限标识列表 */
  const permissions = ref<Permission>([])
  /** 角色标识列表 */
  const roles = ref<Roles>([])

  const isLoggedIn = computed(() => !!accessToken.value)
  const username = computed(() => userInfo.value?.username ?? '')
  const nickname = computed(() => userInfo.value?.nickname ?? '')
  const avatar = computed(() => userInfo.value?.avatar ?? '')

  /** 获取当前用户信息与菜单（登录后 / 刷新后恢复 token 时调用），用户数据会写入 userInfo 并持久化 */
  const getUserInfo = async () => {
    try {
      const res = (await GetInfo()) as GetPermissionInfoResult
      const u = res?.user ?? (res as any)?.data
      if (u && typeof u === 'object') {
        userInfo.value = { ...u } as User
      }
      const list = res?.menus
      menus.value = list?.length ? list : defaultMenus
      permissions.value = res?.permissions ?? []
      roles.value = res?.roles ?? []
      return userInfo.value
    } catch {
      menus.value = defaultMenus
      return null
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
   * 初始化：有 token 时拉取用户信息与菜单，保证展示的是接口返回的数据
   */
  const init = async () => {
    if (import.meta.client) {
      if (accessToken.value) {
        await getUserInfo()
      }
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

  return {
    accessToken,
    refreshToken,
    userInfo,
    tenantId,
    expiresTime,
    menus,
    permissions,
    roles,
    isLoggedIn,
    username,
    nickname,
    avatar,
    logout,
    getUserInfo,
    init,
    setLoginResult,
  }
}, {
  persist: {
    pick: ['accessToken', 'refreshToken', 'tenantId', 'userInfo', 'menus', 'permissions', 'roles'],
  },
})