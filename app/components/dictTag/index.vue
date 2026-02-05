<template>
    <el-tag v-if="label" :type="resolvedType">
      {{ label }}
    </el-tag>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { ElementPlusInfoType } from '@/types/elementPlus'
  import type { DictDataType } from '@/stores/dict'
  import { getDictOptions } from '@/utils/dict'
  
  const props = defineProps<{
    /** 字典类型，如 DICT_TYPE.COMMON_STATUS */
    type: string
    /** 实际值，如 0 / 1 */
    value: string | number | boolean
  }>()
  
  // 当前字典类型下的所有选项
  const options = computed<DictDataType[]>(() => getDictOptions(props.type))
  
  console.log(options.value,'options======');
  // 当前 value 对应的字典项
  const currentItem = computed<DictDataType | undefined>(() =>
    options.value.find((item) => item.value == props.value)
  )
  console.log(currentItem.value,'currentItem======');
  // 展示文本：优先字典 label，找不到则回退为原始 value
  const label = computed(() =>
    currentItem.value ? currentItem.value.label : props.value != null ? String(props.value) : ''
  )
  
  // Tag 颜色类型：直接使用字典中的 colorType 映射到 el-tag 的 type
  const resolvedType = computed<ElementPlusInfoType | undefined>(() =>
    (currentItem.value?.colorType as ElementPlusInfoType | undefined)
  )
  </script>
  
  