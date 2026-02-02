<!-- components/layout/AppTabs.vue -->
<template>
  <div
    class="app-tabs bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-1 flex items-center gap-2"
  >
    <el-scrollbar>
      <div class="flex items-center gap-1">
        <div
          v-for="tab in appStore.tabs"
          :key="tab.path"
          class="tab-item"
          :class="{ active: tab.path === route.path }"
          @click="handleTabClick(tab)"
        >
          <span>{{ tab.title }}</span>
          <el-icon
            v-if="tab.path !== '/'"
            class="close-icon"
            @click.stop="appStore.removeTab(tab.path)"
          >
            <Close />
          </el-icon>
        </div>
      </div>
    </el-scrollbar>

    <!-- 更多操作 -->
    <el-dropdown @command="handleCommand">
      <el-icon class="cursor-pointer"><More /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
          <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { Close, More } from "@element-plus/icons-vue";

const route = useRoute();
const appStore = useAppStore();

const handleTabClick = (tab: any) => {
  navigateTo(tab.path);
};

const handleCommand = (command: string) => {
  switch (command) {
    case "closeOther":
      appStore.closeOtherTabs(route.path);
      break;
    case "closeAll":
      appStore.closeAllTabs();
      break;
  }
};
</script>

<style scoped>
.tab-item {
  @apply px-3 py-1 rounded cursor-pointer flex items-center gap-2 text-sm
      bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
      hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors;
}

.tab-item.active {
  @apply bg-primary text-white;
}

.close-icon {
  @apply hover:bg-white/20 rounded-full p-0.5;
}
</style>
