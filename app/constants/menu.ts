import type { Menu } from '@/api/user/type'

/** 默认左侧菜单（接口未返回或为空时使用）：系统管理 -> 用户管理、角色管理、菜单管理 */
export const defaultMenus: Menu[] = [
  {
    id: 1,
    parentId: 0,
    name: 'menu.system',
    path: '/system',
    // 默认左侧菜单也使用统一的 Icon 格式（ep: 前缀）
    icon: 'ep:setting',
    alwaysShow: true,
    keepAlive: false,
    visible: true,
    component: null,
    componentName: null,
    children: [
      { id: 2, parentId: 1, name: 'menu.user', path: '/system/user', icon: 'ep:user', alwaysShow: false, keepAlive: false, visible: true, component: null, componentName: null, children: [] },
      { id: 3, parentId: 1, name: 'menu.role', path: '/system/role', icon: 'ep:user-filled', alwaysShow: false, keepAlive: false, visible: true, component: null, componentName: null, children: [] },
      { id: 4, parentId: 1, name: 'menu.menu', path: '/system/menu', icon: 'ep:menu', alwaysShow: false, keepAlive: false, visible: true, component: null, componentName: null, children: [] },
    ],
  },
]
