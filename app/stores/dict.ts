// stores/dict.ts
import type { ElementPlusInfoType } from '@/types/elementPlus'

export interface DictDataType {
  dictType: string
  label: string
  value: string | number | boolean
  colorType: ElementPlusInfoType | ''
  cssClass: string
}

const COMMON_STATUS = 'common_status'
const SYSTEM_MENU_TYPE = 'system_menu_type'

export const useDictStore = defineStore('dict', () => {
  const dictMap = ref<Record<string, DictDataType[]>>({
    [COMMON_STATUS]: [
      { dictType: COMMON_STATUS, label: '关闭', value: 1, colorType: 'info', cssClass: '' },
      { dictType: COMMON_STATUS, label: '开启', value: 0, colorType: 'success', cssClass: '' },
    ],
    [SYSTEM_MENU_TYPE]: [
      { dictType: SYSTEM_MENU_TYPE, label: '目录', value: 1, colorType: 'primary', cssClass: '' },
      { dictType: SYSTEM_MENU_TYPE, label: '菜单', value: 2, colorType: 'success', cssClass: '' },
      { dictType: SYSTEM_MENU_TYPE, label: '按钮', value: 3, colorType: 'info', cssClass: '' },
    ],
  })

  const getDictByType = (dictType: string): DictDataType[] => {
    return dictMap.value[dictType] ?? []
  }

  const setDicts = (dictType: string, list: DictDataType[]) => {
    dictMap.value[dictType] = list
  }

  return {
    dictMap,
    getDictByType,
    setDicts,
  }
})
