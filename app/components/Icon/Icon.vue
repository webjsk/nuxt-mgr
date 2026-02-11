<script lang="ts" setup>
import * as ElementPlusIcons from '@element-plus/icons-vue'

defineOptions({ name: 'Icon', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    icon?: string
    color?: string
    size?: number
    svgClass?: string
  }>(),
  { size: 16, svgClass: '' }
)

const attrs = useAttrs()

// 只有针对第三方动态图标库，如果 serverBundle 没覆盖到，才可能需要 client-only
// 但为了极致丝滑，我们优先尝试直出

const rootClass = computed(() => [
  'custom-common-icon',
  'el-icon', // 保持 el-icon 类名以适配 Element Plus 侧边栏收起逻辑
  attrs.class,
  props.svgClass
])

const parsed = computed(() => {
  if (!props.icon) return { prefix: '', name: '' }
  const idx = props.icon.indexOf(':')
  // 如果没有冒号，默认判定为 ep: (Element Plus)
  if (idx < 0) return { prefix: 'ep:', name: props.icon }
  return {
    prefix: props.icon.slice(0, idx + 1),
    name: props.icon.slice(idx + 1),
  }
})

/** Element Plus 图标解析 */
const epIconComponent = computed(() => {
  const name = parsed.value.name
  if (!name || parsed.value.prefix !== 'ep:') return null
  const pascal = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
  return (ElementPlusIcons as Record<string, any>)[pascal] ?? null
})

/** 判定是否为 Element Plus 图标 */
const isEp = computed(() => parsed.value.prefix === 'ep:')

/** * 判定是否为其他图标库 (FA6 等)
 * 只要带冒号且不是 ep:，就交给 @nuxt/icon 处理
 */
const isExternalIcon = computed(() => !!props.icon && props.icon.includes(':') && !isEp.value)

const iconStyle = computed(() => ({
  color: props.color,
  fontSize: props.size ? `${props.size}px` : undefined,
  width: props.size ? `${props.size}px` : '1em',
  height: props.size ? `${props.size}px` : '1em',
}))
</script>

<template>
  <el-icon :class="rootClass" :style="iconStyle">
    <template v-if="isEp && epIconComponent">
      <component :is="epIconComponent" />
    </template>

    <template v-else-if="isExternalIcon">
      <NuxtIcon :name="icon!" />
    </template>

    <template v-else>
      <span>{{ parsed.name || icon }}</span>
    </template>
  </el-icon>
</template>

<style scoped>
.custom-common-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;
}
/* 确保 NuxtIcon 继承颜色和大小 */
:deep(.iconify) {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>