<!-- pages/index.vue -->
<template>
  <div class="p-6">
    <!-- 欢迎卡片 -->
    <div class="card p-6 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 class="text-3xl font-bold mb-2">👋 欢迎回来！</h1>
      <p class="text-blue-100">今天是 {{ currentDate }}</p>
    </div>

    <!-- 数据统计 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">用户总数</p>
            <p class="text-2xl font-bold mt-2">1,234</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex-center">
            <el-icon :size="24" color="#409eff"><User /></el-icon>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <span class="text-green-500">↑ 12%</span>
          <span class="text-gray-500 dark:text-gray-400 ml-2">较上月</span>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">访问量</p>
            <p class="text-2xl font-bold mt-2">8,456</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex-center">
            <el-icon :size="24" color="#67c23a"><TrendCharts /></el-icon>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <span class="text-green-500">↑ 8%</span>
          <span class="text-gray-500 dark:text-gray-400 ml-2">较上月</span>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">订单数</p>
            <p class="text-2xl font-bold mt-2">567</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex-center">
            <el-icon :size="24" color="#e6a23c"><ShoppingCart /></el-icon>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <span class="text-red-500">↓ 3%</span>
          <span class="text-gray-500 dark:text-gray-400 ml-2">较上月</span>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">收入</p>
            <p class="text-2xl font-bold mt-2">¥89,234</p>
          </div>
          <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex-center">
            <el-icon :size="24" color="#f56c6c"><Money /></el-icon>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <span class="text-green-500">↑ 15%</span>
          <span class="text-gray-500 dark:text-gray-400 ml-2">较上月</span>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">快捷操作</h3>
        <div class="grid grid-cols-2 gap-3">
          <el-button class="h-20" @click="$router.push('/system/user')">
            <div class="flex flex-col items-center gap-2">
              <el-icon :size="24"><User /></el-icon>
              <span>用户管理</span>
            </div>
          </el-button>
          <el-button class="h-20" @click="$router.push('/system/role')">
            <div class="flex flex-col items-center gap-2">
              <el-icon :size="24"><UserFilled /></el-icon>
              <span>角色管理</span>
            </div>
          </el-button>
          <el-button class="h-20" @click="$router.push('/system/menu')">
            <div class="flex flex-col items-center gap-2">
              <el-icon :size="24"><Menu /></el-icon>
              <span>菜单管理</span>
            </div>
          </el-button>
          <el-button class="h-20">
            <div class="flex flex-col items-center gap-2">
              <el-icon :size="24"><Setting /></el-icon>
              <span>系统设置</span>
            </div>
          </el-button>
        </div>
      </div>

      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">最近活动</h3>
        <el-timeline>
          <el-timeline-item timestamp="2024-01-20 10:30" placement="top">
            <p>用户 <strong>张三</strong> 登录了系统</p>
          </el-timeline-item>
          <el-timeline-item timestamp="2024-01-20 09:15" placement="top">
            <p>管理员创建了新角色 <strong>"编辑"</strong></p>
          </el-timeline-item>
          <el-timeline-item timestamp="2024-01-19 16:45" placement="top">
            <p>系统备份已完成</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, TrendCharts, ShoppingCart, Money, UserFilled, Menu, Setting } from '@element-plus/icons-vue'

const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})
</script>