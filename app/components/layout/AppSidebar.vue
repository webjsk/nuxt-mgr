<!-- components/layout/AppSidebar.vue -->
<template>
  <aside
    class="app-sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden flex flex-col"
    :class="[
      appStore.sidebarCollapsed ? 'w-16' : 'w-64',
      appStore.isMobile && !appStore.sidebarCollapsed ? 'fixed left-0 top-0 bottom-0 z-[999]' : ''
    ]"
  >
    <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 cursor-pointer" @click="handleLogoClick">
      <div v-if="!appStore.sidebarCollapsed" class="flex items-center gap-2">
        <span class="text-lg font-bold text-gray-900 dark:text-white">Admin System</span>
      </div>
    </div>

    <el-scrollbar class="flex-1">
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        class="border-none"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <template #title>{{ $t('menu.dashboard') }}</template>
        </el-menu-item>
        <template v-for="item in displayMenus" :key="item.id">
          <el-sub-menu v-if="item.children?.length" :index="item.path">
            <template #title>
              <el-icon><component :is="resolveIcon(item.icon)" /></el-icon>
              <span>{{ resolveMenuName(item.name) }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.id"
              :index="child.path"
            >
              <el-icon><component :is="resolveIcon(child.icon)" /></el-icon>
              <template #title>{{ resolveMenuName(child.name) }}</template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="resolveIcon(item.icon)" /></el-icon>
            <template #title>{{ resolveMenuName(item.name) }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import { HomeFilled, Setting, User, UserFilled, Menu } from '@element-plus/icons-vue'
import { defaultMenus } from '@/constants/menu'

const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const activeMenu = computed(() => route.path)

/** 按 visible 过滤菜单树（只展示 visible 为 true 的项） */
function filterMenusByVisible<T extends { visible?: boolean; children?: T[] }>(items: T[]): T[] {
  if (!items?.length) return []
  return items
    .filter((item) => item.visible !== false)
    .map((item) => ({
      ...item,
      children: item.children?.length ? filterMenusByVisible(item.children) : [],
    }))
}

/** 拼接为完整 path，避免双斜杠 */
function joinPath(parentPath: string, childPath: string): string {
  const p = (parentPath || '').replace(/\/+$/, '')
  const c = (childPath || '').replace(/^\/+/, '')
  return p ? `${p}/${c}` : `/${c}` || '/'
}

/** 多级菜单 path 规范化：子级 path 处理成完整路径，如 system 下的 user -> /system/user */
function normalizeMenuPaths<T extends { path?: string; children?: T[] }>(
  items: T[],
  parentPath = ''
): T[] {
  if (!items?.length) return []
  return items.map((item) => {
    const fullPath = parentPath ? joinPath(parentPath, item.path ?? '') : (item.path ?? '').replace(/^\/+/, '/') || '/'
    const children = item.children?.length
      ? normalizeMenuPaths(item.children, fullPath)
      : []
    return { ...item, path: fullPath, children }
  })
}

/** 展示的菜单：接口返回或默认配置，按 visible 过滤，并规范化多级 path */
const displayMenus = computed(() => {
  const list = userStore.menus
  const raw = list?.length ? list : defaultMenus
  const filtered = filterMenusByVisible(raw)
  return normalizeMenuPaths(filtered)
})

const iconMap: Record<string, any> = {
  Setting,
  User,
  UserFilled,
  Menu,
  HomeFilled,
}

function resolveIcon(iconName: string) {
  return iconMap[iconName] ?? Setting
}

/** 菜单名：若为 i18n key（如 menu.xxx）则翻译，否则原样 */
function resolveMenuName(name: string) {
  if (!name) return ''
  return name.startsWith('menu.') ? t(name) : name
}

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const handleLogoClick = () => {
  router.push('/')
}
</script>

<style scoped>
/* 自定义菜单样式 */
:deep(.el-menu) {
  background-color: transparent;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  @apply text-gray-700 dark:text-gray-300;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  @apply bg-gray-100 dark:bg-gray-700;
}

:deep(.el-menu-item.is-active) {
  @apply bg-primary/10 text-primary;
}
</style>