<!-- pages/system/menu.vue -->
<template>
    <div class="p-6">
      <div class="card p-6">
        <h2 class="text-xl font-bold mb-4">菜单管理</h2>
        
        <div class="mb-4">
          <el-button type="primary" :icon="Plus">新增菜单</el-button>
          <el-button :icon="Refresh">刷新</el-button>
        </div>
  
        <el-table
          :data="tableData"
          row-key="id"
          default-expand-all
          :tree-props="{ children: 'children' }"
        >
          <el-table-column prop="title" label="菜单名称" width="200" />
          <el-table-column prop="icon" label="图标" width="80">
            <template #default="{ row }">
              <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="路由路径" />
          <el-table-column prop="component" label="组件路径" />
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.isHidden ? 'info' : 'success'">
                {{ row.isHidden ? '隐藏' : '显示' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default>
              <el-button link type="primary" :icon="Plus">新增</el-button>
              <el-button link type="primary" :icon="Edit">编辑</el-button>
              <el-button link type="danger" :icon="Delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Plus, Edit, Delete, Refresh } from '@element-plus/icons-vue'
  
  definePageMeta({
    title: '菜单管理',
  })
  
  const route = useRoute()
  const appStore = useAppStore()
  
  onMounted(() => {
    appStore.addTab({
      path: route.path,
      title: '菜单管理',
      name: route.name as string,
    })
  })
  
  const tableData = ref([
    {
      id: 1,
      title: '系统管理',
      icon: 'Setting',
      path: '/system',
      component: 'Layout',
      sort: 1,
      isHidden: false,
      children: [
        {
          id: 11,
          title: '用户管理',
          icon: 'User',
          path: '/system/user',
          component: 'system/user',
          sort: 1,
          isHidden: false,
        },
        {
          id: 12,
          title: '角色管理',
          icon: 'UserFilled',
          path: '/system/role',
          component: 'system/role',
          sort: 2,
          isHidden: false,
        },
        {
          id: 13,
          title: '菜单管理',
          icon: 'Menu',
          path: '/system/menu',
          component: 'system/menu',
          sort: 3,
          isHidden: false,
        },
      ],
    },
  ])
  </script>