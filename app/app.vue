<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
 // ✅ 只需要初始化 store 即可
// useColorMode 会自动处理 DOM 操作
const themeStore = useThemeStore()
  </script>