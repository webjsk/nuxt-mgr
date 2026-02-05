/**
 * 全局指令：v-hasPermi
 * 用法：v-hasPermi="'system:user:add'" 或 v-hasPermi="['system:user:add', 'system:user:edit']"
 * 传入 string 或 string[]，用户权限列表（store.permissions）包含即显示，否则移除节点
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('hasPermi', {
    mounted(el, binding) {
      checkPermi(el, binding)
    },
    updated(el, binding) {
      checkPermi(el, binding)
    },
  })
})

function checkPermi(
  el: HTMLElement,
  binding: { value?: string | string[] }
) {
  const userStore = useUserStore()
  const permissions: string[] = userStore.permissions ?? []

  const value = binding.value
  if (value === undefined || value === null || value === '') {
    return
  }

  const permList = Array.isArray(value) ? value : [value]
  const hasPermi = permList.some((p) => permissions.includes(p))

  if (!hasPermi && el.parentNode) {
    el.parentNode.removeChild(el)
  }
}
