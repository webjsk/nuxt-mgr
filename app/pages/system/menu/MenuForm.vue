<template>
  <!-- 简单占位表单，用于菜单新增 / 编辑，对应 index.vue 中的 <MenuForm /> -->
  <div>
    MenuForm 组件占位（待实现具体表单）
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'MenuForm' })

// 暴露给父组件调用的 open 方法：open(type, id?, parentId?)
const open = (_type: string, _id?: number, _parentId?: number) => {
  // 这里先预留实现，后续你可以替换成真实的弹窗 + 表单逻辑
  // console.log('open MenuForm', _type, _id, _parentId)
}

// 提供一个 emit 接口，和父组件 index.vue 中的 @success="getList" 对应
const emit = defineEmits<{
  (e: 'success'): void
}>()

// 你在保存成功时调用 emit('success') 即可通知父组件刷新列表
</script>