<!-- pages/system/user.vue -->
<template>
    <div class="p-6">
      <div class="card p-6">
        <h2 class="text-xl font-bold mb-4">用户管理</h2>
        
        <!-- 搜索栏 -->
        <div class="mb-4 flex gap-2">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入用户名"
            class="w-64"
            clearable
          />
          <el-button type="primary" :icon="Search">搜索</el-button>
          <el-button :icon="Refresh">重置</el-button>
          <el-button type="primary" :icon="Plus">新增用户</el-button>
        </div>
  
        <!-- 表格 -->
        <el-table :data="tableData" stripe>
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="nickname" label="昵称" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色" />
          <el-table-column label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" :icon="Edit">编辑</el-button>
              <el-button link type="danger" :icon="Delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 分页 -->
        <div class="mt-4 flex justify-end">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
  
  definePageMeta({
    title: '用户管理',
  })
  
  // 监听路由，添加标签页
  const route = useRoute()
  const appStore = useAppStore()
  
  onMounted(() => {
    appStore.addTab({
      path: route.path,
      title: '用户管理',
      name: route.name as string,
    })
  })
  
  const searchForm = reactive({
    keyword: '',
  })
  
  const tableData = ref([
    {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      email: 'admin@example.com',
      role: '超级管理员',
      status: 1,
    },
    {
      id: 2,
      username: 'user',
      nickname: '普通用户',
      email: 'user@example.com',
      role: '普通用户',
      status: 1,
    },
    {
      id: 3,
      username: 'test',
      nickname: '测试用户',
      email: 'test@example.com',
      role: '测试',
      status: 0,
    },
  ])
  
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 3,
  })
  </script>