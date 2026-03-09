/**
 * App 全局状态：侧边栏、设备、全屏、标签页、组件尺寸等
 */
export const useApp = defineStore('app', () => {
  // ========== 侧边栏状态 ==========
  const sidebarCollapsed = ref(false)

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  // ========== 设备检测 ==========
  const isMobile = ref(false)

  const checkDevice = () => {
    if (import.meta.client) {
      isMobile.value = window.innerWidth < 768
      if (isMobile.value) {
        sidebarCollapsed.value = true
      }
    }
  }

  // ========== 全屏状态 ==========
  const isFullscreen = ref(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      document.exitFullscreen?.()
      isFullscreen.value = false
    }
  }

  // ========== 组件尺寸（影响 Table、Pagination 等紧凑模式） ==========
  type SizeType = 'default' | 'small'

  const currentSize = ref<SizeType>('default')

  const setCurrentSize = (size: SizeType) => {
    currentSize.value = size
  }

  // ========== 标签页 ==========
  interface Tab {
    path: string
    title: string
    name: string
    icon?: string
  }

  const tabs = ref<Tab[]>([
    { path: '/', title: '首页', name: 'index', icon: 'ep:home-filled' }
  ])

  const activeTab = ref('/')

  const addTab = (tab: Tab) => {
    const exists = tabs.value.find(t => t.path === tab.path)
    if (!exists) {
      tabs.value.push(tab)
    } else {
      exists.title = tab.title
      if (tab.icon !== undefined) exists.icon = tab.icon
    }
    activeTab.value = tab.path
  }

  const removeTab = (path: string) => {
    const index = tabs.value.findIndex(t => t.path === path)
    if (index > -1) {
      tabs.value.splice(index, 1)
      if (activeTab.value === path && tabs.value.length > 0) {
        const newActiveTab = tabs.value[Math.max(0, index - 1)]
        activeTab.value = newActiveTab.path
        navigateTo(newActiveTab.path)
      }
    }
  }

  const closeOtherTabs = (path: string) => {
    tabs.value = tabs.value.filter(t => t.path === path || t.path === '/')
  }

  const closeAllTabs = () => {
    tabs.value = [{ path: '/', title: '首页', name: 'index', icon: 'ep:home-filled' }]
    activeTab.value = '/'
    navigateTo('/')
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
    isMobile,
    checkDevice,
    isFullscreen,
    toggleFullscreen,
    currentSize,
    setCurrentSize,
    tabs,
    activeTab,
    addTab,
    removeTab,
    closeOtherTabs,
    closeAllTabs,
  }
})
