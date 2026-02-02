// types/api.ts
/** API 响应基础结构 */
export interface ApiResponse<T = any> {
    code: number
    data: T
    msg: string
  }
  
  /** 分页参数 */
  export interface PageParams {
    page: number
    pageSize: number
    [key: string]: any
  }
  
  /** 分页结果 */
  export interface PageResult<T = any> {
    list: T[]
    total: number
    page: number
    pageSize: number
  }