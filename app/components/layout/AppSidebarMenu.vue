<template>
  <template v-for="item in items" :key="item.id">
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <Icon
          v-if="item.icon"
          :icon="item.icon"
          class="el-icon" 
        />
        <span class="menu-title-text">{{ resolveMenuName(item.name) }}</span>
      </template>
      <LayoutAppSidebarMenu
        :items="item.children"
        :resolve-menu-name="resolveMenuName"
      />
    </el-sub-menu>

    <el-menu-item v-else :index="item.path">
      <Icon
        v-if="item.icon"
        :icon="item.icon"
        class="el-icon"
      />
      <template #title>
        <span class="menu-title-text">{{ resolveMenuName(item.name) }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { Menu } from '@/api/user/type'

defineOptions({ name: 'AppSidebarMenu' })

defineProps<{
  items: Menu[]
  resolveMenuName: (name: string) => string
}>()
</script>

<style scoped>
/* 针对展开状态下的图标间距微调 */
.el-icon {
  margin-right: 12px;
  flex-shrink: 0;
}

/* 确保在深层级菜单中图标依然保持对齐 */
:deep(.el-sub-menu__title), :deep(.el-menu-item) {
  display: flex;
  align-items: center;
}
</style>