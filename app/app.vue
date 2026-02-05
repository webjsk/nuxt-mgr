<script setup lang="ts">
const { $elementLocale } = useNuxtApp();
// const userStore = useUserStore();
// await userStore.init();
</script>

<template>
  <el-config-provider :locale="$elementLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </el-config-provider>
</template>
