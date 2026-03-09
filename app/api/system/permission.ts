import { http } from '@/utils/http'

export interface PermissionAssignUserRoleReqVO {
  userId: number
  roleIds: number[]
}

export interface PermissionAssignRoleMenuReqVO {
  roleId: number
  menuIds: number[]
}

export interface PermissionAssignRoleDataScopeReqVO {
  roleId: number
  dataScope: number
  dataScopeDeptIds: number[]
}

// 查询角色拥有的菜单权限
export const GetRoleMenuList = (roleId: number) => {
  return http.get<number[]>('/system/permission/list-role-menus?roleId=' + roleId)
}

// 赋予角色菜单权限
export const AssignRoleMenu = (data: PermissionAssignRoleMenuReqVO) => {
  return http.post('/system/permission/assign-role-menu', data)
}

// 赋予角色数据权限
export const AssignRoleDataScope = (data: PermissionAssignRoleDataScopeReqVO) => {
  return http.post('/system/permission/assign-role-data-scope', data)
}

// 查询用户拥有的角色数组
export const GetUserRoleList = (userId: number) => {
  return http.get<number[]>('/system/permission/list-user-roles?userId=' + userId)
}

// 赋予用户角色
export const AssignUserRole = (data: PermissionAssignUserRoleReqVO) => {
  return http.post('/system/permission/assign-user-role', data)
}
