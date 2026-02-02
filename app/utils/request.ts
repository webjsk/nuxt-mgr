/** 将 headers 转为普通对象（兼容 Headers 实例与 plain object） */
function headersToPlain(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) return {}
  if (headers instanceof Headers) {
    const o: Record<string, string> = {}
    headers.forEach((v, k) => { o[k] = v })
    return o
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers as [string, string][])
  }
  return { ...headers } as Record<string, string>
}

export const $api = $fetch.create({
  timeout: 30000,

  async onRequest({ options }) {
    const config = useRuntimeConfig()
    const userStore = useUserStore()

    options.baseURL = config.public.apiBase

    const defaultContentType = 'application/json'
    const headers = headersToPlain(options.headers as Headers | undefined)
    headers['Content-Type'] = headers['Content-Type'] || defaultContentType
    // 从 Nuxt 应用取当前语言（不能在这里用 useI18n()，否则会报 "Must be called at the top of a setup function"）
    const nuxtApp = tryUseNuxtApp()
    const locale = nuxtApp?.$i18n?.locale
    headers['language'] = String(locale?.value ?? locale ?? '')

    if (userStore.accessToken) {
      headers['Authorization'] = `Bearer ${userStore.accessToken}`
    }

    // 设置租户（环境变量 NUXT_PUBLIC_TENANT_ENABLE=true 时生效）
    const tenantEnable = String(config.public.tenantEnable ?? '').toLowerCase()
    if (tenantEnable === 'true') {
      const tid = userStore.tenantId
      if (tid !== undefined && tid !== null && tid !== '') {
        headers['tenant-id'] = String(tid)
      }
    }

    options.headers = headers as HeadersInit

    // GET 防缓存
    if (options.method?.toUpperCase() === 'GET') {
      options.params = { ...options.params, _t: Date.now() }
    }

    // Loading 逻辑 (仅客户端)
    if (options.showLoading && import.meta.client) {
      options.loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
  },

  async onResponse({ response, options }) {
    if (options.loadingInstance) options.loadingInstance.close()
    // 请求级配置：标记为原始响应则跳过标准拦截，直接透传（由 http.postOriginal 等传入）
    if ((options as any).rawResponse === true) return
    const res = response._data
    if (res.code === 0) {
      if (options.showSuccess) ElMessage.success(options.successMessage || '操作成功')
      return
    }
    handleBusinessError(res)
  },

  async onResponseError({ response, options }) {
    if (options.loadingInstance) options.loadingInstance.close()
    handleHttpError(response.status, response.statusText)
  }
})

// 下面的 handleBusinessError 和 handleHttpError 保持原样即可

/** 业务错误码的固定处理（除这些外，统一用接口返回的 msg 提示） */
const BUSINESS_CODE_HANDLERS: Record<number, (res: any) => void> = {
  401: (res) => {
    ElMessage.error('登录已过期')
    useUserStore().logout()
    useRouter().push('/login')
  },
}

/** 辅助函数：业务错误代码处理；未单独列出的 code 统一提示接口返回的 msg */
function handleBusinessError(res: any) {
  const handler = res?.code != null && BUSINESS_CODE_HANDLERS[res.code]
  if (handler) {
    handler(res)
  } else {
    const msg = res?.msg ?? res?.message ?? '请求失败'
    ElMessage.error(msg)
  }
}

/** 辅助函数：HTTP 状态码处理 */
function handleHttpError(status: number, statusText: string) {
  const map: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    404: '资源不存在',
    500: '服务器错误',
  }
  ElMessage.error(map[status] || statusText || '网络错误')
}