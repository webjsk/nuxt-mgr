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

export const useDictStore = defineStore('dict', () => {
  const dictMap = ref<Record<string, DictDataType[]>>({
    [COMMON_STATUS]: [
      { dictType: COMMON_STATUS, label: '关闭', value: 0, colorType: 'info', cssClass: '' },
      { dictType: COMMON_STATUS, label: '开启', value: 1, colorType: 'success', cssClass: '' },
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
