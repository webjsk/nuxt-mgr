// plugins/auth.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore();

  // 在这里 init，由于是全局插件且 await，它会阻塞 Hydration 直到数据就位
  // 这样当页面开始渲染时，menus 已经是填满的状态，绝不会闪烁
  if (import.meta.server || import.meta.client) {
    await userStore.init();
  }
});
