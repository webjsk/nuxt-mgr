<script setup lang="ts">
  const { $elementLocale } = useNuxtApp()
  </script>
  
  <template>
    <el-config-provider :locale="$elementLocale">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </el-config-provider>
  </template>