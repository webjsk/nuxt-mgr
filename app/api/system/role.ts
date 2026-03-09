import { http } from '@/utils/http'
import type { PageResult } from '@/types/api'

export interface RoleVO {
  id: number
  name: string
  code: string
  sort: number
  status: number
  type?: number
  dataScope?: number
  dataScopeDeptIds?: number[]
  createTime?: Date
  remark?: string
}

export interface UpdateStatusReqVO {
  id: number
  status: number
}

// 查询角色分页列表（params 支持 pageNo/page 等后端约定字段）
export const GetRolePage = (params: Record<string, any>) => {
  return http.get<PageResult<RoleVO>>('/system/role/page', params)
}

// 查询角色（精简）列表
export const GetSimpleRoleList = () => {
  return http.get<RoleVO[]>('/system/role/simple-list')
}

// 查询角色详情
export const GetRole = (id: number) => {
  return http.get<RoleVO>('/system/role/get?id=' + id)
}

// 新增角色
export const CreateRole = (data: RoleVO) => {
  return http.post('/system/role/create', data)
}

// 修改角色
export const UpdateRole = (data: RoleVO) => {
  return http.put('/system/role/update', data)
}

// 修改角色状态
export const UpdateRoleStatus = (data: UpdateStatusReqVO) => {
  return http.put('/system/role/update-status', data)
}

// 删除角色
export const DeleteRole = (id: number) => {
  return http.delete('/system/role/delete?id=' + id)
}

// 导出角色
export const ExportRole = (params: any) => {
  return http.get('/system/role/export-excel', params)
}
