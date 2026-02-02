<!-- components/layout/AppBreadcrumb.vue -->
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">
      {{ $t("menu.dashboard") }}
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
const route = useRoute();

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.name);
  return matched.map((item) => ({
    path: item.path,
    title: item.meta.title || item.name,
  }));
});
</script>
