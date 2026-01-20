<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
    <div class="max-w-4xl mx-auto">
      <!-- 头部 -->
      <div class="flex-between mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t('menu.dashboard') }}
        </h1>
        <div class="flex items-center gap-3">
          <!-- 当前语言显示 -->
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('language.' + (locale === 'zh-CN' ? 'zhCN' : 'enUS')) }}
          </span>
          <!-- 语言切换 -->
          <CommonLanguageToggle />
          <!-- 主题切换 -->
          <CommonThemeToggle />
        </div>
      </div>

      <!-- 按钮测试 -->
      <div class="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {{ $t('common.action') }}
        </h2>
        <div class="space-x-2">
          <el-button type="primary">{{ $t('common.add') }}</el-button>
          <el-button type="success">{{ $t('common.edit') }}</el-button>
          <el-button type="danger">{{ $t('common.delete') }}</el-button>
          <el-button type="info">{{ $t('common.search') }}</el-button>
        </div>
      </div>

      <!-- 表单测试 -->
      <div class="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {{ $t('login.title') }}
        </h2>
        <el-form :model="form" label-width="100px">
          <el-form-item :label="$t('login.username')">
            <el-input v-model="form.username" :placeholder="$t('login.usernameRequired')" />
          </el-form-item>
          <el-form-item :label="$t('login.password')">
            <el-input v-model="form.password" type="password" :placeholder="$t('login.passwordRequired')" />
          </el-form-item>

          <el-form-item :label="$t('login.password')">
            <el-date-picker v-model="form.date" type="date" placeholder="Select date" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary">{{ $t('login.loginBtn') }}</el-button>
            <el-button>{{ $t('common.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 菜单测试 -->
      <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {{ $t('menu.menu') }}
        </h2>
        <div class="space-y-2">
          <div>{{ $t('menu.dashboard') }}</div>
          <div>{{ $t('menu.system') }}</div>
          <div>{{ $t('menu.user') }}</div>
          <div>{{ $t('menu.role') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, t } = useI18n()

const form = reactive({
  username: '',
  password: '',
  date: new Date().toISOString().split('T')[0]
})
</script>