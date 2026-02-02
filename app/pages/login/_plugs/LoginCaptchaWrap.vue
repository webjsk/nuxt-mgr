<template>
  <div>
    <VerifySlide
      captcha-type="blockPuzzle"
      type="2"
      mode="pop"
      :initial-captcha="initialCaptcha ?? undefined"
    />
  </div>
</template>

<script setup lang="ts">
import type { GetCodeResult } from '@/api/login/type'
import { reactive, toRefs } from 'vue'
import VerifySlide from './VerifySlide.vue'

defineProps<{
  /** 预加载的验证码数据，有则优先使用避免弹窗内再请求 */
  initialCaptcha?: GetCodeResult['repData'] | null
}>()

const emit = defineEmits<{
  (e: 'success', payload: { captchaVerification: string }): void
  (e: 'close'): void
}>()

const state = reactive({ clickShow: true })

const closeBox = () => {
  state.clickShow = false
  emit('close')
}

defineExpose({
  closeBox,
  ...toRefs(state),
})
</script>
