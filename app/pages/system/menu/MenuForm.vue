<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    destroy-on-close
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="上级菜单">
        <el-tree-select
          v-model="formData.parentId"
          :data="menuTree"
          :default-expanded-keys="[0]"
          :props="treeSelectProps"
          check-strictly
          node-key="id"
          placeholder="请选择上级菜单"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="formData.name" clearable placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio-button
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_MENU_TYPE)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.type !== SystemMenuTypeEnum.BUTTON" label="菜单图标" prop="icon">
        <IconSelect v-model="formData.icon" />
      </el-form-item>
      <el-form-item v-if="formData.type !== SystemMenuTypeEnum.BUTTON" label="路由地址" prop="path">
        <el-tooltip content="访问的路由地址，如：user。外网地址以 http(s):// 开头" placement="top">
          <el-input v-model="formData.path" clearable placeholder="请输入路由地址" />
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="formData.type === SystemMenuTypeEnum.MENU" label="组件地址" prop="component">
        <el-input v-model="formData.component" clearable placeholder="例如：system/user/index" />
      </el-form-item>
      <el-form-item v-if="formData.type === SystemMenuTypeEnum.MENU" label="组件名字" prop="componentName">
        <el-input v-model="formData.componentName" clearable placeholder="例如：SystemUser" />
      </el-form-item>
      <el-form-item v-if="formData.type !== SystemMenuTypeEnum.DIR" label="权限标识" prop="permission">
        <el-tooltip
          content="Controller 方法上的权限字符，如：@PreAuthorize(`@ss.hasPermission('system:user:list')`)"
          placement="top"
        >
          <el-input v-model="formData.permission" clearable placeholder="请输入权限标识" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" controls-position="right" style="width: 100%" />
      </el-form-item>
      <el-form-item label="菜单状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.type !== SystemMenuTypeEnum.BUTTON" label="显示状态" prop="visible">
        <el-tooltip content="选择隐藏时，路由将不会出现在侧边栏，但仍然可以访问" placement="top">
          <el-radio-group v-model="formData.visible">
            <el-radio :value="true" border>显示</el-radio>
            <el-radio :value="false" border>隐藏</el-radio>
          </el-radio-group>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="formData.type !== SystemMenuTypeEnum.BUTTON" label="总是显示" prop="alwaysShow">
        <el-tooltip
          content="选择否时，当该菜单只有一个子菜单时，不展示自己，直接展示子菜单"
          placement="top"
        >
          <el-radio-group v-model="formData.alwaysShow">
            <el-radio :value="true" border>是</el-radio>
            <el-radio :value="false" border>否</el-radio>
          </el-radio-group>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="formData.type === SystemMenuTypeEnum.MENU" label="缓存状态" prop="keepAlive">
        <el-tooltip content="选择缓存时会被 keep-alive 缓存，须填写组件名称" placement="top">
          <el-radio-group v-model="formData.keepAlive">
            <el-radio :value="true" border>缓存</el-radio>
            <el-radio :value="false" border>不缓存</el-radio>
          </el-radio-group>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import type { MenuVO } from '@/api/system/menu'
import {
  GetMenu,
  GetSimpleMenusList,
  CreateMenu,
  UpdateMenu,
} from '@/api/system/menu'
import { SystemMenuTypeEnum } from '@/constants/system'
import type { Tree } from '@/utils/tree'
import { handleTree } from '@/utils/tree'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/composables/useMessage'

defineOptions({ name: 'SystemMenuForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref<'create' | 'update'>('create')

const defaultFormData: Partial<MenuVO> & {
  parentId: number
  visible: boolean
  keepAlive: boolean
  alwaysShow: boolean
} = {
  id: undefined,
  name: '',
  permission: '',
  type: SystemMenuTypeEnum.DIR,
  sort: 0,
  parentId: 0,
  path: '',
  icon: '',
  component: '',
  componentName: '',
  status: 1,
  visible: true,
  keepAlive: true,
  alwaysShow: true,
}

const formData = ref({ ...defaultFormData })
const formRules = {
  name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '菜单状态不能为空', trigger: 'change' }],
}
const formRef = ref<{ validate: () => Promise<boolean>; resetFields: () => void }>()
const treeSelectProps = { label: 'name', value: 'id' }
const menuTree = ref<Tree[]>([])

const emit = defineEmits<{ success: [] }>()

/** 打开弹窗 */
const open = async (type: 'create' | 'update', id?: number, parentId?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? t('action.create') : t('action.update')
  formType.value = type
  resetForm()
  if (parentId !== undefined) {
    formData.value.parentId = parentId
  }
  await loadMenuTree()
  if (id !== undefined) {
    formLoading.value = true
    try {
      const data = await GetMenu(id)
      formData.value = {
        ...defaultFormData,
        ...data,
        parentId: data.parentId ?? 0,
        visible: data.visible ?? true,
        keepAlive: data.keepAlive ?? true,
        alwaysShow: data.alwaysShow ?? true,
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

function resetForm() {
  formData.value = { ...defaultFormData }
  formRef.value?.resetFields()
}

function handleClosed() {
  resetForm()
}

async function loadMenuTree() {
  const res = await GetSimpleMenusList()
  const root: Tree = { id: 0, name: '主类目', children: handleTree(res as any) }
  menuTree.value = [root]
}

function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

async function submitForm() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  const data = formData.value
  if (data.type === SystemMenuTypeEnum.DIR || data.type === SystemMenuTypeEnum.MENU) {
    if (!isExternal(data.path || '')) {
      if (data.parentId === 0 && (data.path || '').charAt(0) !== '/') {
        message.error('路径必须以 / 开头')
        return
      }
      if (data.parentId !== 0 && (data.path || '').charAt(0) === '/') {
        message.error('路径不能以 / 开头')
        return
      }
    }
  }

  formLoading.value = true
  try {
    if (formType.value === 'create') {
      await CreateMenu(formData.value as MenuVO)
      message.success(t('common.createSuccess'))
    } else {
      await UpdateMenu(formData.value as MenuVO)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
