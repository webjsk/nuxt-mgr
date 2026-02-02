// types/user.ts
/** 用户信息 */
export interface User {
    id: string | number
    username: string
    nickname: string
    avatar?: string
    email?: string
    phone?: string
    roles: string[]
    permissions: string[]
    createTime?: string
    updateTime?: string
  }
  
  /** 登录参数 */
  export interface LoginParams {
    tenantName: string
    tenantId?: number // 由租户名解析得到，提交登录时传入
    username: string
    password: string
    captcha?: string
    rememberMe?: boolean
  }
  
  /** 登录结果 */
  export interface LoginResult {
    accessToken: string
    refreshToken: string
    userId:number
    expiresTime?: number  // token 过期时间（秒）
  }
  
  /** 修改密码参数 */
  export interface ChangePasswordParams {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }