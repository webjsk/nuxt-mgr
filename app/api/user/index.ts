import { http } from '@/utils/http'
import type { GetPermissionInfoResult } from './type'
  /**
 * ✅ 获取用户权限信息（SSR + CSR，使用 useFetch）
 */
export const useGetInfo = () => {
  return useApiData<GetPermissionInfoResult>('/system/auth/get-permission-info', {
    method: 'GET',
    // ✅ SSR 配置
    server: true,  // 服务端执行
    lazy: false,   // 立即执行
    immediate: true, // 立即执行
  })
}