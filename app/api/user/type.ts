
/** 菜单项（树形） */
export interface Menu {
  alwaysShow: boolean
  children: Menu[]
  component: string | null
  componentName: string | null
  icon: string
  id: number
  keepAlive: boolean
  name: string
  parentId: number
  path: string
  visible: boolean
}

export type Permission = string[]
export type Roles = string[]

export interface UserInfoFromApi {
  avatar: string
  deptId: number | null
  id: number
  nickname: string
}

/** get-permission-info 接口返回 */
export interface GetPermissionInfoResult {
  user?: UserInfoFromApi
  menus?: Menu[]
  permissions?: Permission
  roles?: Roles
}
