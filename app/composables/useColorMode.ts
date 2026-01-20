// composables/useColorMode.ts
// 自定义 useColorMode，使用 cookie 存储（SSR 友好）

export type ColorMode = 'light' | 'dark'

export interface UseColorModeOptions {
  storageKey?: string
  modes?: Record<string, string>
  initialValue?: ColorMode
}

export function useColorMode(options: UseColorModeOptions = {}) {
  const {
    storageKey = 'theme-mode',
    modes = { light: 'light', dark: 'dark' },
    initialValue = 'light',
  } = options

  // 使用 Nuxt 的 useCookie 来存储主题（SSR 友好）
  const themeCookie = useCookie<ColorMode>(storageKey, {
    sameSite: 'lax',
    secure: false, // 开发环境可以设为 false，生产环境建议设为 true
    maxAge: 60 * 60 * 24 * 365, // 1 年
    default: () => initialValue,
  })

  // 创建响应式的 colorMode ref，初始值从 cookie 读取（服务端和客户端都能访问）
  const colorMode = ref<ColorMode>(themeCookie.value || initialValue)

  // 更新 DOM 的函数（仅在客户端执行）
  const updateDOM = (value: ColorMode) => {
    if (import.meta.client && typeof document !== 'undefined') {
      const html = document.documentElement
      if (value === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  // 监听 colorMode 变化，同步到 cookie 和 DOM
  watch(colorMode, (newValue) => {
    // 更新 cookie
    themeCookie.value = newValue
    // 更新 DOM
    updateDOM(newValue)
  }, { immediate: true })

  // 初始化时设置 DOM（仅在客户端）
  if (import.meta.client) {
    onMounted(() => {
      updateDOM(colorMode.value)
    })
  }

  return colorMode
}

