import type { UseFetchOptions } from 'nuxt/app'
import { $api } from '@/utils/request'
// 定义扩展配置
interface CustomOptions {
  showLoading?: boolean
  showSuccess?: boolean
  successMessage?: string
  showError?: boolean
}

export const useApi = <T = any>(
  url: string | (() => string),
  options: UseFetchOptions<T> & CustomOptions = {}
) => {
  return useFetch(url, {
    ...options,
    $fetch: $api, // 关键：使用我们上面定义的统一实例
  })
}