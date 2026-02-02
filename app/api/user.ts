// api/user.ts
import type { User, ChangePasswordParams } from '@/types/user'
import type { PageParams, PageResult } from '@/types/api'

/**
 * 获取用户列表
 */
export const getUserListApi = (params: PageParams) => {
  return httpGet<PageResult<User>>('/user/list', params)
}

/**
 * 获取用户详情
 */
export const getUserDetailApi = (id: string | number) => {
  return httpGet<User>(`/user/${id}`)
}

/**
 * 创建用户
 */
export const createUserApi = (data: Partial<User>) => {
  return httpPost<User>('/user', data, {
    showSuccess: true,
    successMessage: '创建成功',
  })
}

/**
 * 更新用户
 */
export const updateUserApi = (id: string | number, data: Partial<User>) => {
  return httpPut<User>(`/user/${id}`, data, {
    showSuccess: true,
    successMessage: '更新成功',
  })
}

/**
 * 删除用户
 */
export const deleteUserApi = (id: string | number) => {
  return httpDelete(`/user/${id}`, undefined, {
    showSuccess: true,
    successMessage: '删除成功',
  })
}

/**
 * 修改密码
 */
export const changePasswordApi = (data: ChangePasswordParams) => {
  return httpPost('/user/change-password', data, {
    showSuccess: true,
    successMessage: '密码修改成功',
  })
}