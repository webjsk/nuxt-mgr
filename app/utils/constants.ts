/**
 * 枚举类
 */

// ========== COMMON 模块 ==========
// 全局通用状态枚举
export const CommonStatusEnum = {
  ENABLE: 0, // 开启
  DISABLE: 1, // 禁用
};


/**
 * 数据权限的范围枚举
 */
export const SystemDataScopeEnum = {
  ALL: 1, // 全部数据权限
  DEPT_CUSTOM: 2, // 指定部门数据权限
  DEPT_ONLY: 3, // 部门数据权限
  DEPT_AND_CHILD: 4, // 部门及以下数据权限
  DEPT_SELF: 5 // 仅本人数据权限
}