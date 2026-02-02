<!-- 使用 ElCard 作为通用内容容器，用于包裹页面内容 -->
<template>
  <el-card class="content-wrap" v-bind="$attrs">
    <slot />
  </el-card>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ContentWrap',
  inheritAttrs: false,
})
</script>

<style scoped>
.content-wrap {
  border-radius: 8px;
}
</style>