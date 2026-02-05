import type { ElementPlusInfoType } from '@/types/elementPlus'
import { useDictStore } from '@/stores/dict'

/** 与 stores/dict 中 DictDataType 保持一致，供组件使用 */
export interface DictDataType {
  dictType: string
  label: string
  value: string | number | boolean
  colorType: ElementPlusInfoType | ''
  cssClass: string
}

export interface NumberDictDataType extends DictDataType {
  value: number
}

/**
 * 获取 dictType 对应的数据字典数组
 * @param dictType 数据类型
 * @returns 数据字典数组
 */
export const getDictOptions = (dictType: string): DictDataType[] => {
  return useDictStore().getDictByType(dictType) || []
}
export const getIntDictOptions = (dictType: string): NumberDictDataType[] => {
    // 获得通用的 DictDataType 列表
    const dictOptions: DictDataType[] = getDictOptions(dictType)
    // 转换成 number 类型的 NumberDictDataType 类型
    // why 需要特殊转换：避免 IDEA 在 v-for="dict in getIntDictOptions(...)" 时，el-option 的 key 会告警
    const dictOption: NumberDictDataType[] = []
    dictOptions.forEach((dict: DictDataType) => {
        dictOption.push({
            ...dict,
            value: parseInt(dict.value + '')
        })
    })
    return dictOption
}

export enum DICT_TYPE {
    COMMON_STATUS = 'common_status',
}  