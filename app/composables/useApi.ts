// composables/useApi.ts
import type { UseFetchOptions } from 'nuxt/app'
import type { ApiResponse } from '@/types/api'
import { $api } from '@/utils/request'

interface CustomOptions {
  showLoading?: boolean
  showSuccess?: boolean
  successMessage?: string
  showError?: boolean
  rawResponse?: boolean
}

/**
 * ✅ 方式1：返回完整的 useFetch 响应（推荐用于 composables/stores）
 */
export const useApi = <T = any>(
  url: string | (() => string),
  options: UseFetchOptions<ApiResponse<T>> & CustomOptions = {}
) => {
  return useFetch<ApiResponse<T>>(url, {
    ...options,
    $fetch: $api,
  })
}

/**
 * ✅ 方式2：自动提取 data 字段
 */
export const useApiData = <T = any>(
  url: string | (() => string),
  options: UseFetchOptions<ApiResponse<T>> & CustomOptions = {}
) => {
  return useFetch<ApiResponse<T>, any, any, any, T>(url, {
    ...options,
    $fetch: $api,
    transform: (res) => res.data as T,
  })
}

/**
 * ✅ 方式3：延迟加载（用于组件）
 */
export const useLazyApi = <T = any>(
  url: string | (() => string),
  options: UseFetchOptions<ApiResponse<T>> & CustomOptions = {}
) => {
  return useLazyFetch<ApiResponse<T>>(url, {
    ...options,
    $fetch: $api,
  })
}

/**
 * ✅ 方式4：延迟 + 自动提取 data
 */
export const useLazyApiData = <T = any>(
  url: string | (() => string),
  options: UseFetchOptions<ApiResponse<T>> & CustomOptions = {}
) => {
  return useLazyFetch<ApiResponse<T>, any, any, any, T>(url, {
    ...options,
    $fetch: $api,
    transform: (res) => res.data as T,
  })
}