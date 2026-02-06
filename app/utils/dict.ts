import { useDictStore } from '@/stores/dict'
import type { DictDataType } from '@/stores/dict'

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
// 获取数字类型的字典选项
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
  SYSTEM_MENU_TYPE = 'system_menu_type',
}  