<!-- components/common/ThemeToggle.vue -->
<template>
  <ClientOnly>
    <el-button
      :icon="isDark ? Moon : Sunny"
      circle
      @click="toggleTheme"
      :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
    />
    <!-- <template #fallback>
      <el-button circle :icon="Sunny" title="加载中..." />
    </template> -->
  </ClientOnly>
</template>

<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>