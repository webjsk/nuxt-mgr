import { visualizer } from "rollup-plugin-visualizer";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  // 启用 Nuxt 4 特性
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  // 模块配置
  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@element-plus/nuxt", // Element Plus
    "@nuxtjs/tailwindcss", // 添加 TailwindCSS 模块
    "@pinia/nuxt", // Pinia（需在 persistedstate 之前）
    "@pinia-plugin-persistedstate/nuxt", // Pinia 持久化
    "@nuxtjs/i18n",
  ],
  // 添加 CSS
  css: ["~/assets/css/tailwind.css", "~/assets/css/main.css"],
  // TailwindCSS 配置
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config",
    exposeConfig: false,
    viewer: true,
  },
  elementPlus: {
    // 样式导入方式：'css' | 'sass' | false
    importStyle: "css",
    // 主题配置
    themes: ["dark"],
    // 自动引入配置（默认已启用）
    // @element-plus/nuxt 会自动按需导入组件和方法，无需手动 import
    // 组件：el-button、el-input、el-table 等会自动注册
    // 方法：ElMessage、ElNotification、ElMessageBox 等会自动引入
  },
  // i18n 配置
  i18n: {
    locales: [
      {
        code: "zh-CN",
        name: "简体中文",
        file: "zh-CN.json",
      },
      {
        code: "en-US",
        name: "English",
        file: "en-US.json",
      },
    ],
    langDir: "../app/locales", // 语言文件目录（相对于项目根目录）
    defaultLocale: "zh-CN", // 默认语言
    strategy: "no_prefix", // 不在 URL 中显示语言前缀
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_locale",
      redirectOn: "root",
    },
  },
  // ✅ Pinia 持久化配置
  piniaPluginPersistedstate: {
    storage: "localStorage",
    cookieOptions: {
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 天
    },
  },
  // 运行时配置（可在 .env 中覆盖）
  runtimeConfig: {
    public: {
      // 前端可访问的 API 基础地址
      apiBase:
        import.meta.env.NUXT_PUBLIC_API_BASE || "https://api-test.xxxx.mx",
      /** 是否启用租户模式，为 'true' 时请求头会携带 tenant-id */
      tenantEnable: import.meta.env.NUXT_PUBLIC_TENANT_ENABLE || "true",
    },
  },
  // 路由规则
  // routeRules: {
  //   // "/": { ssr: false },                    // 首页
  // },
  // Vite 优化配置
  vite: {
    plugins: [
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }) as any,
    ],
    // 优化构建配置
    build: {
      // 启用代码压缩
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境移除 console
          drop_debugger: true,
        },
      },
      // 代码分割优化
      rollupOptions: {
        output: {
          // // 手动分包，将 Element Plus 和 lodash 单独打包
          // manualChunks: {
          //   'element-plus': ['element-plus'],
          //   'element-plus-icons': ['@element-plus/icons-vue'],
          // },
        },
      },
      // 减少 chunk 大小警告阈值
      chunkSizeWarningLimit: 1000,
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: [
        "element-plus",
        "@element-plus/icons-vue",
        "dayjs",
        "dayjs/plugin/customParseFormat",
        "dayjs/plugin/advancedFormat",
        "dayjs/plugin/weekOfYear",
        "dayjs/plugin/weekYear",
        "dayjs/plugin/dayOfYear",
        "dayjs/plugin/isSameOrAfter",
        "dayjs/plugin/isSameOrBefore",
      ],
    },
  },
  app: {
    head: {
      script: [
        {
          // 设置主题类
          innerHTML: `
            (function() {
              try {
                // 在页面渲染前读取 cookie 并设置主题类
                var cookies = document.cookie.split(';');
                var themeCookie = cookies.find(function(cookie) {
                  return cookie.trim().startsWith('theme-mode=');
                });
                var theme = themeCookie ? themeCookie.split('=')[1].trim() : 'light';
                
                // 立即在 html 标签上添加类名（在 CSS 加载前）
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `,
          type: "text/javascript",
          tagPosition: "head",
        },
      ],
    },
  },
});
