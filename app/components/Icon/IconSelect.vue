<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { IconJson } from './data'

defineOptions({ name: 'IconSelect' })

type ParameterCSSProperties = (item?: string) => CSSProperties | undefined

const props = defineProps<{
  modelValue?: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string) }>()

const visible = ref(false)
const iconList = ref(IconJson)
const icon = ref('add-location')
const currentActiveType = ref('ep:')
const copyIconList = JSON.parse(JSON.stringify(IconJson)) as typeof IconJson

const pageSize = ref(96)
const currentPage = ref(1)
const filterValue = ref('')

const tabsList = [
  { label: 'Element Plus', name: 'ep:' },
  { label: 'Font Awesome 4', name: 'fa:' },
  { label: 'Font Awesome 5 Solid', name: 'fa-solid:' },
]

const pageList = computed(() => {
  const list = copyIconList[currentActiveType.value]?.filter((v) => v.includes(filterValue.value)) ?? []
  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

const iconCount = computed(() => {
  return copyIconList[currentActiveType.value]?.filter((v) => v.includes(filterValue.value)).length ?? 0
})

const iconItemStyle = computed((): ParameterCSSProperties => {
  return (item) => {
    if (props.modelValue === currentActiveType.value + item) {
      return {
        borderColor: 'var(--el-color-primary)',
        color: 'var(--el-color-primary)',
      }
    }
  }
})

function handleClick(pane: { props?: { name: string } }) {
  currentPage.value = 1
  const name = pane?.props?.name ?? 'ep:'
  currentActiveType.value = name
  const first = iconList.value[name]?.[0]
  if (first) {
    icon.value = first
    emit('update:modelValue', name + first)
  }
}

function onChangeIcon(item: string) {
  icon.value = item
  emit('update:modelValue', currentActiveType.value + item)
  visible.value = false
}

function onCurrentChange(page: number) {
  currentPage.value = page
}

watch(
  () => props.modelValue,
  (val) => {
    if (val && val.includes(':')) {
      const idx = val.indexOf(':') + 1
      currentActiveType.value = val.substring(0, idx)
      icon.value = val.substring(idx)
    }
  },
  { immediate: true }
)
watch(filterValue, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="iconslt_box">
    <ElInput
      :model-value="modelValue"
      @click="visible = !visible"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template #append>
        <ElPopover
          v-model:visible="visible"
          :popper-options="{ placement: 'auto' }"
          :width="350"
          popper-class="iconslt_pop"
          trigger="click"
        >
          <template #reference>
            <div
              class="h-32px w-40px flex cursor-pointer items-center justify-center"
              @click="visible = !visible"
            >
              <Icon :icon="currentActiveType + icon" />
            </div>
          </template>

          <ElInput v-model="filterValue" class="p-2" clearable placeholder="搜索图标" />
          <ElDivider border-style="dashed" />

          <ElTabs v-model="currentActiveType" @tab-click="handleClick">
            <ElTabPane
              v-for="(pane, index) in tabsList"
              :key="index"
              :label="pane.label"
              :name="pane.name"
            >
              <ElDivider border-style="dashed" class="tab_div" />
              <ElScrollbar height="220px">
                <ul class="ml-2 flex flex-wrap px-2">
                  <li
                    v-for="(item, key) in pageList"
                    :key="key"
                    :style="iconItemStyle(item)"
                    :title="item"
                    class="icon_item mr-2 mt-2 w-1/6 h-12 flex cursor-pointer items-center justify-center border border-solid rounded-md p-1"
                    @click="onChangeIcon(item)"
                  >
                    <Icon :icon="currentActiveType + item" />
                  </li>
                </ul>
              </ElScrollbar>
            </ElTabPane>
          </ElTabs>
          <ElDivider border-style="dashed" />

          <ElPagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="iconCount"
            background
            class="h-10 flex items-center justify-center"
            layout="prev, pager, next"
            size="small"
            @current-change="onCurrentChange"
          />
        </ElPopover>
      </template>
    </ElInput>
  </div>
</template>

<!-- 仅作用于本组件弹层，避免影响其他页面 -->
<style>
.iconslt_pop.el-popper .el-divider--horizontal {
  margin: 1px auto !important;
}

.iconslt_pop.el-popper .tab_div.el-divider--horizontal {
  margin: 0 !important;
}

.iconslt_pop.el-popper .el-tabs__nav-next {
  font-size: 15px;
  line-height: 32px;
  box-shadow: -5px 0 5px -6px #ccc;
}

.iconslt_pop.el-popper .el-tabs__nav-prev {
  font-size: 15px;
  line-height: 32px;
  box-shadow: 5px 0 5px -6px #ccc;
}

.iconslt_pop.el-popper .el-input-group__append {
  padding: 0;
}

.iconslt_pop.el-popper .el-tabs__item {
  height: 30px;
  font-size: 12px;
  font-weight: normal;
  line-height: 30px;
}

.iconslt_pop.el-popper .el-tabs__header,
.iconslt_pop.el-popper .el-tabs__nav-wrap {
  position: static;
  margin: 0;
}

.iconslt_pop.el-popper .icon_item:hover {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  transform: scaleX(1.05);
  transition: all 0.4s;
}
</style>
