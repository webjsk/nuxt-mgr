<!-- components/layout/AppTabs.vue -->
<template>
  <div
    class="app-tabs bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-1 flex items-center gap-2"
  >
    <el-scrollbar>
      <div class="flex items-center tab-list">
        <div
          v-for="tab in appStore.tabs"
          :key="tab.path"
          class="tab-item"
          :class="{ active: tab.path === route.path }"
          @click="handleTabClick(tab)"
        >
          <Icon v-if="tab.icon" :icon="tab.icon" :size="14" class="tab-item-icon" />
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
import { defaultMenus } from "@/constants/menu";

const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();
const { t } = useI18n();

/** 拼接为完整 path（与侧边栏一致） */
function joinPath(parentPath: string, childPath: string): string {
  const p = (parentPath || "").replace(/\/+$/, "");
  const c = (childPath || "").replace(/^\/+/, "");
  return p ? `${p}/${c}` : `/${c}` || "/";
}

/** 多级菜单 path 规范化（与侧边栏一致），便于用 route.path 匹配 */
function normalizeMenuPaths<T extends { path?: string; children?: T[] }>(
  items: T[],
  parentPath = ""
): T[] {
  if (!items?.length) return [];
  return items.map((item) => {
    const fullPath = parentPath
      ? joinPath(parentPath, item.path ?? "")
      : (item.path ?? "").replace(/^\/+/, "/") || "/";
    const children = item.children?.length
      ? normalizeMenuPaths(item.children, fullPath)
      : [];
    return { ...item, path: fullPath, children };
  });
}

/** 在菜单树中按完整 path 查找项，返回 { name, icon } */
function findMenuByPath(
  menus: { path?: string; name?: string; icon?: string; children?: any[] }[],
  path: string
): { name: string; icon: string } | undefined {
  if (!menus?.length || !path) return undefined;
  for (const item of menus) {
    if (item.path === path) {
      return { name: item.name ?? "", icon: item.icon ?? "" };
    }
    const found = findMenuByPath(item.children ?? [], path);
    if (found) return found;
  }
  return undefined;
}

/** 根据路由自动添加 tab；标题与图标来自菜单 */
function ensureTab() {
  const path = route.path;
  if (!path || path === "/") return;
  const raw = (userStore.menus?.length ? userStore.menus : defaultMenus) as {
    path?: string;
    name?: string;
    icon?: string;
    children?: any[];
  }[];
  const normalizedMenus = normalizeMenuPaths(raw);
  const menu = findMenuByPath(normalizedMenus, path);
  const title = menu?.name
    ? menu.name.startsWith("menu.")
      ? t(menu.name)
      : menu.name
    : (route.meta?.title as string) ?? String(route.name ?? path);
  appStore.addTab({
    path,
    title,
    name: String(route.name ?? ""),
    icon: menu?.icon,
  });
}

onMounted(() => ensureTab());
watch(() => route.path, () => ensureTab());

const handleTabClick = (tab: { path: string }) => {
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
.tab-list {
  gap: 8px;
}

.tab-item {
  @apply px-3 py-1.5 rounded-md cursor-pointer flex items-center gap-2 text-sm
      border border-gray-200 dark:border-gray-600
      bg-transparent text-gray-600 dark:text-gray-300
      transition-colors duration-200;
}

/* 未选中 hover：无灰底、蓝色文字+蓝色 close */
.tab-item:hover:not(.active) {
  @apply border-gray-300 text-primary dark:border-gray-500 dark:text-primary;
}

.tab-item:hover:not(.active) .close-icon {
  color: var(--el-color-primary);
}

/* 选中：蓝底白字，边框与背景同色 */
.tab-item.active {
  @apply border-primary bg-primary text-white;
}

.tab-item.active .close-icon {
  @apply text-white hover:bg-white/20;
}

.tab-item-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.close-icon {
  @apply rounded-full p-0.5 transition-colors duration-200;
}
</style>
