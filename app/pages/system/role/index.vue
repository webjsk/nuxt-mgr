<!-- pages/system/role.vue -->
<template>
    <div class="p-6">
      <div class="card p-6">
        <h2 class="text-xl font-bold mb-4">角色管理</h2>
        
        <div class="mb-4">
          <el-button type="primary" :icon="Plus">新增角色</el-button>
        </div>
  
        <el-table :data="tableData" stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="角色名称" />
          <el-table-column prop="code" label="角色代码" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default>
              <el-button link type="primary" :icon="Edit">编辑</el-button>
              <el-button link type="primary" :icon="Setting">权限</el-button>
              <el-button link type="danger" :icon="Delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Plus, Edit, Delete, Setting } from '@element-plus/icons-vue'
  
  definePageMeta({
    title: '角色管理',
  })
  
  const route = useRoute()
  const appStore = useAppStore()
  
  onMounted(() => {
    appStore.addTab({
      path: route.path,
      title: '角色管理',
      name: route.name as string,
    })
  })
  
  const tableData = ref([
    {
      id: 1,
      name: '超级管理员',
      code: 'admin',
      description: '拥有所有权限',
      status: 1,
    },
    {
      id: 2,
      name: '普通用户',
      code: 'user',
      description: '基础权限',
      status: 1,
    },
  ])
  </script>