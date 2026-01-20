<!-- components/common/LanguageToggle.vue -->
<template>
    <el-dropdown @command="handleCommand">
      <el-button circle>
        <el-icon><Menu /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            command="zh-CN"
            :disabled="locale === 'zh-CN'"
          >
            🇨🇳 简体中文
          </el-dropdown-item>
          <el-dropdown-item 
            command="en-US"
            :disabled="locale === 'en-US'"
          >
            🇺🇸 English
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </template>
  
  <script setup lang="ts">
  // Element Plus Icons 中没有 Globe 图标，使用 Menu 图标替代
  import { Menu } from '@element-plus/icons-vue'
  
  const { locale, setLocale } = useI18n()
  
  const handleCommand = (lang: "zh-CN" | "en-US") => {
    setLocale(lang)
    ElMessage.success(
      lang === 'zh-CN' ? '切换到简体中文' : 'Switched to English'
    )
  }
  </script>