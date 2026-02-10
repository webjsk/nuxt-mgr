<!-- components/layout/AppBreadcrumb.vue -->
<template>
  <Transition name="breadcrumb" mode="out-in">
    <el-breadcrumb :key="route.path" separator="/" class="breadcrumb-wrap">
      <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
        <span class="inline-flex items-center gap-1">
          <Icon v-if="item.icon" :icon="item.icon" class="el-icon" />
          {{ item.title }}
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </Transition>
</template>

<script setup lang="ts">
import type { Menu } from '@/api/user/type'
import { defaultMenus } from '@/constants/menu'

const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()

function joinPath(parentPath: string, childPath: string): string {
  const p = (parentPath || '').replace(/\/+$/, '')
  const c = (childPath || '').replace(/^\/+/, '')
  return p ? `${p}/${c}` : `/${c}` || '/'
}

function normalizeMenuPaths<T extends { path?: string; children?: T[] }>(
  items: T[],
  parentPath = ''
): T[] {
  if (!items?.length) return []
  return items.map((item) => {
    const fullPath = parentPath
      ? joinPath(parentPath, item.path ?? '')
      : (item.path ?? '').replace(/^\/+/, '/') || '/'
    const children = item.children?.length
      ? normalizeMenuPaths(item.children, fullPath)
      : []
    return { ...item, path: fullPath, children }
  })
}

/** 在菜单树中按 path 查找项 */
function findMenuByPath(
  menus: { path?: string; name?: string; icon?: string; children?: any[] }[],
  path: string
): { path: string; name: string; icon: string } | undefined {
  if (!menus?.length || !path) return undefined
  for (const item of menus) {
    if (item.path === path) {
      return {
        path: item.path ?? '',
        name: item.name ?? '',
        icon: item.icon ?? '',
      }
    }
    const found = findMenuByPath(item.children ?? [], path)
    if (found) return found
  }
  return undefined
}

function resolveMenuName(name: string): string {
  if (!name) return ''
  return name.startsWith('menu.') ? t(name) : name
}

/** 根据当前路由 path 解析面包屑：首页时仅一项「Icon+首页」，其余从菜单树解析 */
const breadcrumbList = computed(() => {
  const path = route.path
  if (!path || path === '/') {
    return [{ path: '/', title: t('menu.home'), icon: 'ep:home-filled' }]
  }

  const raw = (userStore.menus?.length ? userStore.menus : defaultMenus) as Menu[]
  const normalized = normalizeMenuPaths(raw)
  const segments = path.split('/').filter(Boolean)
  const list: { path: string; title: string; icon: string }[] = []
  let current = ''

  for (const seg of segments) {
    current = current ? `${current}/${seg}` : `/${seg}`
    const menu = findMenuByPath(normalized, current)
    list.push({
      path: current,
      title: menu ? resolveMenuName(menu.name) : seg,
      icon: menu?.icon ?? '',
    })
  }
  return list
})
</script>

<style scoped>
.breadcrumb-wrap {
  display: inline-flex;
}

/* 切换时淡入 + 轻微右移，更丝滑 */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
