// api/auth.ts
import type { LoginParams, LoginResult, User } from '@/types/user'

/**
 * 登录
 */
export const loginApi = (data: LoginParams) => {
  return httpPost<LoginResult>('/auth/login', data, {
    showLoading: true,
  })
}

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  return httpGet<User>('/auth/user')
}

/**
 * 退出登录
 */
export const logoutApi = () => {
  return httpPost('/auth/logout')
}

/**
 * 刷新 token
 */
export const refreshTokenApi = (token: string) => {
  return httpPost<{ token: string }>('/auth/refresh', { token })
}