<template>
  <aside
    class="app-sidebar transition-all duration-300 overflow-hidden flex flex-col"
    :class="[
      appStore.sidebarCollapsed ? 'w-16' : 'w-64',
      appStore.isMobile && !appStore.sidebarCollapsed ? 'fixed left-0 top-0 bottom-0 z-[999]' : ''
    ]"
    style="background-color: #0f172a; border-right: 1px solid #1f2937;"
  >
    <div
      class="h-16 flex items-center border-b border-white/10 cursor-pointer px-3"
      @click="handleLogoClick"
    >
      <img src="~/assets/imgs/login/logo.png" alt="Logo" class="h-9 w-auto flex-shrink-0" />
      <Transition name="sidebar-logo">
        <span v-if="!appStore.sidebarCollapsed" class="ml-3 text-xl font-bold tracking-wide text-white">
          MGR
        </span>
      </Transition>
    </div>

    <el-scrollbar class="flex-1">
        <el-menu
          :key="'sidebar-' + appStore.sidebarCollapsed"
          :default-active="activeMenu"
          :collapse="appStore.sidebarCollapsed"
          :collapse-transition="false"
          active-text-color="#3b82f6"
          background-color="#111827"
          text-color="#e5e7eb"
          class="el-menu-vertical-demo border-none"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/">
            <Icon icon="ep:home-filled" class="el-icon mr-1" />
            <template #title>
              <span class="menu-title-text">{{ dashboardTitle }}</span>
            </template>
          </el-menu-item>

          <LayoutAppSidebarMenu
            :items="displayMenus"
            :resolve-menu-name="resolveMenuName"
          />
        </el-menu>

        <template #placeholder>
          <div class="w-full h-full bg-[#111827]" />
        </template>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const dashboardTitle = computed(() => t('menu.home'))
const activeMenu = computed(() => route.path)

/** 菜单处理逻辑保持不变 */
function filterMenusByVisible(items: any[]): any[] {
  if (!items?.length) return []
  return items
    .filter((item) => item.visible !== false)
    .map((item) => ({
      ...item,
      children: item.children?.length ? filterMenusByVisible(item.children) : [],
    }))
}

function joinPath(p1: string, p2: string) {
  const p = p1.replace(/\/+$/, '')
  const c = p2.replace(/^\/+/, '')
  return p ? `${p}/${c}` : `/${c}`
}

function normalizeMenuPaths(items: any[], parentPath = ''): any[] {
  if (!items?.length) return []
  return items.map((item) => {
    const fullPath = parentPath ? joinPath(parentPath, item.path ?? '') : (item.path ?? '').replace(/^\/+/, '/') || '/'
    return { 
      ...item, 
      path: fullPath, 
      children: normalizeMenuPaths(item.children || [], fullPath) 
    }
  })
}

const displayMenus = computed(() => {
  const raw = userStore.menus?.length ? userStore.menus : []
  return normalizeMenuPaths(filterMenusByVisible(raw))
})

const resolveMenuName = (name: string) => (name?.startsWith('menu.') ? t(name) : name)
const handleMenuSelect = (index: string) => router.push(index)
const handleLogoClick = () => router.push('/')
</script>

<style scoped>
/* 1. 基础边框处理 */
:deep(.el-menu) { 
  border: none !important; 
}

/* 2. 展开状态下的图标与文字间距 (保持美观) */
:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  margin-right: 12px;
  transition: margin 0.3s;
}

/* 3. 【核心修复】收起状态的精准对齐 */
:deep(.el-menu--collapse) {
  width: 100% !important;

  /* 解决对不齐：强制让每一个菜单项容器变成 flex 居中 */
  .el-menu-item,
  .el-sub-menu__title {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 0 !important;
    position: relative;
  }

  /* 解决展示不同：移除展开时的 margin，确保图标在 64px (w-16) 宽度内绝对居中 */
  .el-icon, 
  .custom-common-icon {
    margin: 0 !important;
    /* 强制重置图标容器宽度，防止被 Element 默认样式撑歪 */
    width: auto !important; 
    height: auto !important;
    visibility: visible !important;
  }

  /* 彻底隐藏文字和箭头，防止它们占据宽度导致图标偏移 */
  .menu-title-text,
  .el-sub-menu__icon-arrow {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
  }
}

/* 4. 统一图标大小，确保不同库的图标视觉权重一致 */
:deep(.custom-common-icon) {
  font-size: 18px !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-menu-item .el-menu-tooltip__trigger){
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

/* 5. Logo 动画 */
.sidebar-logo-enter-active { transition: all 0.2s ease; }
.sidebar-logo-enter-from { opacity: 0; transform: translateX(-10px); }
</style>