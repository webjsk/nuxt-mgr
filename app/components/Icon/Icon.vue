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

// 只有在挂载后才渲染真实的图标组件，防止 SSR 报错
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const rootClass = computed(() => {
  const classes: Array<string | undefined> = ['custom-common-icon']
  if (attrs.class && typeof attrs.class === 'string') {
    classes.push(attrs.class)
  }
  if (props.svgClass) {
    classes.push(props.svgClass)
  }
  return classes
})

const parsed = computed(() => {
  if (!props.icon) return { prefix: '', name: '' }
  const idx = props.icon.indexOf(':')
  if (idx < 0) return { prefix: 'ep:', name: props.icon }
  return {
    prefix: props.icon.slice(0, idx + 1),
    name: props.icon.slice(idx + 1),
  }
})

const epIconComponent = computed(() => {
  const name = parsed.value.name
  if (!name || parsed.value.prefix !== 'ep:') return null
  const pascal = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
  return (ElementPlusIcons as Record<string, any>)[pascal] ?? null
})

const isEp = computed(() => parsed.value.prefix === 'ep:')
const isFa = computed(() => parsed.value.prefix === 'fa:' || parsed.value.prefix === 'fa-solid:')

const iconStyle = computed(() => ({
  color: props.color,
  fontSize: props.size ? `${props.size}px` : undefined,
  width: props.size ? `${props.size}px` : '1em',
  height: props.size ? `${props.size}px` : '1em',
}))
</script>

<template>
  <el-icon
    :class="rootClass"
    :style="iconStyle"
  >
    <template v-if="isEp">
      <component v-if="mounted && epIconComponent" :is="epIconComponent" />
      <span v-else class="icon-loading-placeholder" />
    </template>

    <template v-else-if="isFa">
      <NuxtIcon v-if="mounted" :name="icon ?? ''" />
      <span v-else class="icon-loading-placeholder" />
    </template>

    <template v-else>
      <span class="icon-loading-placeholder">{{ parsed.name || icon }}</span>
    </template>
  </el-icon>
</template>

<style scoped>
.custom-common-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-loading-placeholder {
  display: inline-block;
  width: 1em;
  height: 1em;
  visibility: hidden; /* 占位但不显示，防止水合闪烁 */
}
</style>