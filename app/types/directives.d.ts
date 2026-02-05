import type { DirectiveBinding } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    vHasPermi: DirectiveBinding<string | string[]>
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    vHasPermi: DirectiveBinding<string | string[]>
  }
}
