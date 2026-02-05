<!-- components/layout/AppHeader.vue -->
<template>
  <header
    class="app-header h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shadow-sm"
  >
    <!-- 左侧 -->
    <div class="flex items-center gap-4">
      <el-button
        :icon="appStore.sidebarCollapsed ? Expand : Fold"
        circle
        @click="appStore.toggleSidebar"
      />
      <LayoutAppBreadcrumb />
    </div>

    <!-- 右侧 -->
    <div class="flex items-center gap-3">
      <!-- <el-tooltip
        :content="appStore.isFullscreen ? '退出全屏' : '全屏'"
        placement="bottom"
      >
        <el-button
          :icon="appStore.isFullscreen ? FullScreenExit : FullScreen"
          circle
          @click="appStore.toggleFullscreen"
        />
      </el-tooltip> -->

      <CommonLanguageToggle />
      <CommonThemeToggle />

      <!-- 用户菜单 -->
      <el-dropdown @command="handleCommand">
        <div
          class="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <!-- ✅ 使用真实用户信息 -->
          <el-avatar :size="32" :src="userStore.avatar" />
          <div class="flex flex-col items-start">
            <span class="text-sm font-medium">{{ userStore.nickname }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{
              userStore.username
            }}</span>
          </div>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              {{ $t("user.profile") }}
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              {{ $t("user.settings") }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              {{ $t("user.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  Fold,
  Expand,
  FullScreen,
  // FullScreenExit,
  ArrowDown,
  User,
  Setting,
  SwitchButton,
} from "@element-plus/icons-vue";
const appStore = useAppStore();
const userStore = useUserStore(); // ✅ 使用 userStore
const handleCommand = (command: string) => {
  switch (command) {
    case "profile":
      navigateTo("/profile");
      break;
    case "settings":
      navigateTo("/settings");
      break;
    case "logout":
      ElMessageBox.confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        userStore.logout(); // ✅ 调用退出登录
      });
      break;
  }
};
</script>
