<template>
    <!-- 默认布局 -->
    <div class="app-layout h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      <!-- 侧边栏 -->
      <LayoutAppSidebar />
  
      <!-- 主区域 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 顶部栏 -->
        <LayoutAppHeader />
  
        <!-- 标签页 -->
        <LayoutAppTabs />
  
        <!-- 主内容 -->
        <LayoutAppMain>
          <slot />
        </LayoutAppMain>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const appStore = useAppStore()

  onMounted(() => {
    appStore.checkDevice()
    window.addEventListener('resize', appStore.checkDevice)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', appStore.checkDevice)
  })
  </script>