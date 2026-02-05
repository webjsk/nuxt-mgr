import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

export default defineNuxtPlugin((nuxtApp) => {
  // 1. 注册 Element Plus
  nuxtApp.vueApp.use(ElementPlus)

  // 2. 安全地获取 locale
  // 在 Nuxt 中，@nuxtjs/i18n 会将实例注入到 $i18n
  const { $i18n } = nuxtApp

  // 使用 computed 监听语言变化
  const elementLocale = computed(() => {
    // 兼容性写法：优先取 $i18n.locale
    const currentLocale = ($i18n.locale as any).value || $i18n.locale
    return currentLocale === 'zh-CN' ? zhCn : en
  })

  return {
    provide: {
      elementLocale
    }
  }
})