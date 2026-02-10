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
      <ClientOnly>
        <el-menu
          :key="'sidebar-' + appStore.sidebarCollapsed"
          :default-active="activeMenu"
          :collapse="appStore.sidebarCollapsed"
          :collapse-transition="true"
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
      </ClientOnly>
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
:deep(.el-menu) { border: none !important; }

/* 收起状态的精准修正 */
:deep(.el-menu--collapse) {
  width: 100% !important;
}

/* 关键：修复收起时图标不居中或消失的问题 */
:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 0 !important;
}

/* 隐藏收起时的文字内容 */
:deep(.el-menu--collapse .menu-title-text),
:deep(.el-menu--collapse .el-sub-menu__icon-arrow) {
  display: none !important;
}

/* 强制显示图标 */
:deep(.custom-common-icon) {
  /* margin: 0 !important; */
  font-size: 18px !important;
}

.sidebar-logo-enter-active { transition: all 0.2s ease; }
.sidebar-logo-enter-from { opacity: 0; transform: translateX(-10px); }
</style>