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

const rootClass = computed(() => {
  const classes: Array<string | undefined> = []
  if (attrs.class && typeof attrs.class === 'string') {
    classes.push(attrs.class)
  }
  if (props.svgClass) {
    classes.push(props.svgClass)
  }
  return classes
})

/** 解析 icon 字符串，返回前缀(ep:|fa:|fa-solid:) 和图标名 */
const parsed = computed(() => {
  if (!props.icon) return { prefix: '', name: '' }
  const idx = props.icon.indexOf(':')
  if (idx < 0) return { prefix: 'ep:', name: props.icon }
  return {
    prefix: props.icon.slice(0, idx + 1),
    name: props.icon.slice(idx + 1),
  }
})

/** Element Plus 图标组件：kebab-case → PascalCase */
const epIconComponent = computed(() => {
  const name = parsed.value.name
  if (!name || parsed.value.prefix !== 'ep:') return null
  const pascal = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
  return (ElementPlusIcons as Record<string, unknown>)[pascal] ?? null
})

const isEp = computed(() => parsed.value.prefix === 'ep:')
const isFa = computed(() => parsed.value.prefix === 'fa:')
const isFaSolid = computed(() => parsed.value.prefix === 'fa-solid:')

const iconStyle = computed(() => ({
  color: props.color,
  fontSize: props.size ? `${props.size}px` : undefined,
}))
</script>

<template>
  <!-- Element Plus 图标 -->
  <el-icon
    v-if="isEp && epIconComponent"
    :class="rootClass"
    :style="iconStyle"
  >
    <component :is="epIconComponent" />
  </el-icon>

  <!-- Font Awesome 图标：使用 @nuxt/icon (Iconify) 渲染 fa / fa-solid
       为避免内部 span 的 class 在 SSR / 客户端不一致，这里用外层 span 承载自定义类名 -->
  <span
    v-else-if="isFa || isFaSolid"
    :class="rootClass"
  >
    <NuxtIcon
      :name="icon"
      :style="iconStyle"
    />
  </span>

  <!-- 兜底：仅显示名称（未匹配到组件或图标集不支持） -->
  <el-icon
    v-else
    :class="rootClass"
    :style="iconStyle"
  >
    <span class="icon-placeholder">{{ parsed.name || icon }}</span>
  </el-icon>
</template>

<style scoped>
.icon-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1em;
  min-height: 1em;
  font-size: 0.75em;
  line-height: 1;
  opacity: 0.85;
}
</style>
