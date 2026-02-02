// stores/app.ts
export const useAppStore = defineStore('app', () => {
  // ========== 侧边栏状态 ==========
  const sidebarCollapsed = ref(false)  // 是否折叠

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置侧边栏状态
  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  // ========== 设备检测 ==========
  const isMobile = ref(false)

  // 检测设备
  const checkDevice = () => {
    if (import.meta.client) {
      isMobile.value = window.innerWidth < 768
      // 移动端默认折叠侧边栏
      if (isMobile.value) {
        sidebarCollapsed.value = true
      }
    }
  }

  // ========== 全屏状态 ==========
  const isFullscreen = ref(false)

  // 切换全屏
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        isFullscreen.value = false
      }
    }
  }

  // ========== 标签页 ==========
  interface Tab {
    path: string
    title: string
    name: string
  }

  const tabs = ref<Tab[]>([
    { path: '/', title: '首页', name: 'index' }
  ])

  const activeTab = ref('/')

  // 添加标签页
  const addTab = (tab: Tab) => {
    const exists = tabs.value.find(t => t.path === tab.path)
    if (!exists) {
      tabs.value.push(tab)
    }
    activeTab.value = tab.path
  }

  // 移除标签页
  const removeTab = (path: string) => {
    const index = tabs.value.findIndex(t => t.path === path)
    if (index > -1) {
      tabs.value.splice(index, 1)

      // 如果删除的是当前标签，跳转到上一个
      if (activeTab.value === path && tabs.value.length > 0) {
        const newActiveTab = tabs.value[Math.max(0, index - 1)]
        activeTab.value = newActiveTab.path
        navigateTo(newActiveTab.path)
      }
    }
  }

  // 关闭其他标签页
  const closeOtherTabs = (path: string) => {
    tabs.value = tabs.value.filter(t => t.path === path || t.path === '/')
  }

  // 关闭所有标签页
  const closeAllTabs = () => {
    tabs.value = [{ path: '/', title: '首页', name: 'index' }]
    activeTab.value = '/'
    navigateTo('/')
  }

  return {
    // 侧边栏
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,

    // 设备
    isMobile,
    checkDevice,

    // 全屏
    isFullscreen,
    toggleFullscreen,

    // 标签页
    tabs,
    activeTab,
    addTab,
    removeTab,
    closeOtherTabs,
    closeAllTabs,
  }
})