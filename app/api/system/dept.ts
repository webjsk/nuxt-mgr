import { http } from '@/utils/http'
import type { PageResult } from '@/types/api'

export interface DeptVO {
  id?: number
  name: string
  parentId: number
  status: number
  sort: number
  leaderUserId: number
  phone: string
  email: string
  createTime: Date
}

// 查询部门（精简）列表
export const GetSimpleDeptList = () => {
  return http.get<DeptVO[]>('/system/dept/simple-list')
}

// 查询部门列表
export const GetDeptPage = (params: Record<string, any>) => {
  return http.get<PageResult<DeptVO>>('/system/dept/list', params)
}

// 查询部门详情
export const GetDept = (id: number) => {
  return http.get<DeptVO>('/system/dept/get?id=' + id)
}

// 新增部门
export const CreateDept = (data: DeptVO) => {
  return http.post('/system/dept/create', data)
}

// 修改部门
export const UpdateDept = (data: DeptVO) => {
  return http.put('/system/dept/update', data)
}

// 删除部门
export const DeleteDept = (id: number) => {
  return http.delete('/system/dept/delete?id=' + id)
}
