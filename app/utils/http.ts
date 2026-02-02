// utils/http.ts
import { $api } from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export const http = {
    get: async <T = any>(url: string, params?: any, options?: any): Promise<T> => {
        const res = await $api<ApiResponse<T>>(url, { method: 'GET', params, ...options })
        return res.data as T
    },

    post: async <T = any>(url: string, body?: any, options?: any): Promise<T> => {
        const res = await $api<ApiResponse<T>>(url, { method: 'POST', body, ...options })
        return res.data as T
    },
    // 原始响应：跳过标准 code/msg/data 拦截，直接透传（如验证码等）
    postOriginal: <T = any>(url: string, body?: any, options?: any): Promise<T> => {
        return $api<T>(url, { method: 'POST', body, rawResponse: true, ...options }) as Promise<T>
    },

    put: async <T = any>(url: string, body?: any, options?: any): Promise<T> => {
        const res = await $api<ApiResponse<T>>(url, { method: 'PUT', body, ...options })
        return res.data as T
    },

    delete: async <T = any>(url: string, params?: any, options?: any): Promise<T> => {
        const res = await $api<ApiResponse<T>>(url, { method: 'DELETE', params, ...options })
        return res.data as T
    },

    upload: async <T = any>(url: string, formData: FormData, options?: any): Promise<T> => {
        const res = await $api<ApiResponse<T>>(url, {
            method: 'POST',
            body: formData,
            ...options,
        })
        return res.data as T
    },
}