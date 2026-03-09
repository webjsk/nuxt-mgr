import dayjs from 'dayjs'
// import utc from 'dayjs-plugin-utc'
// import timezone from 'dayjs-timezone-iana-plugin'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import type { TableColumnCtx } from 'element-plus'

dayjs.extend(utc)
dayjs.extend(timezone)

/** 默认时区：从 runtimeConfig.public.appTimezone 读取，可在 .env 中通过 NUXT_PUBLIC_APP_TIMEZONE 配置 */
function getDefaultTimezone(): string {
  try {
    return useRuntimeConfig().public.appTimezone as string || 'Etc/GMT+6'
  } catch {
    return 'Etc/GMT+6'
  }
}

// 时间戳 → 指定时区年月日
export function fmtYMDByTemp(ts: number, timezone?: string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!ts) return ''
  const tz = timezone ?? getDefaultTimezone()
  return dayjs(ts).tz(tz).format(format)
}

// 年月日 → 指定时区时间戳
export function fmtTempByYMD(dateStr: string, timezone?: string) {
  const tz = timezone ?? getDefaultTimezone()
  return dayjs.tz(dateStr, 'YYYY-MM-DD HH:mm:ss', tz).valueOf()
}
/**
 * 时间日期转换
 * @param date 当前时间，new Date() 格式
 * @param format 需要转换的时间格式字符串
 * @description format 字符串随意，如 `YYYY-mm、YYYY-mm-dd`
 * @description format 季度："YYYY-mm-dd HH:MM:SS QQQQ"
 * @description format 星期："YYYY-mm-dd HH:MM:SS WWW"
 * @description format 几周："YYYY-mm-dd HH:MM:SS ZZZ"
 * @description format 季度 + 星期 + 几周："YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ"
 * @returns 返回拼接后的时间字符串
 */
export function formatDate(date: Date, format?: string): string {
  // const a = dayjs(date)
  // 日期不存在，则返回空
  if (!date) {
    return ''
  }

  // 日期存在，则进行格式化（时区取自 runtimeConfig.public.appTimezone）
  return date
    ? dayjs(date)
      .tz(getDefaultTimezone())
      .format(format ?? 'YYYY-MM-DD HH:mm:ss')
    : ''
}




/**
 * element plus 的时间 Formatter 实现，使用 YYYY-MM-DD HH:mm:ss 格式
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
export function dateFormatter(_row: any, _column: TableColumnCtx<any>, cellValue: any): string {
  return cellValue ? formatDate(cellValue) : ''
}




