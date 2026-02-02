<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- 左侧：品牌区（宽度 < 1000px 时隐藏） -->
    <aside
      class="hidden min-[1200px]:flex flex-col w-full min-[1200px]:w-[42%] xl:w-[45%] bg-[#2e3a51] text-white shrink-0"
    >
      <!-- 左上角 Logo -->
      <div class="pt-6 pl-6 lg:pt-8 lg:pl-8">
        <div class="flex items-center gap-2">
          <img
            src="@/assets/imgs/login/logo.png"
            alt="Logo"
            class="w-12 h-12"
          />
          <span class="text-xl font-semibold tracking-tight">MGR</span>
        </div>
      </div>

      <!-- 中间 -->
      <div
        class="flex-1 flex items-center justify-center px-6 py-8 min-h-[280px]"
      >
        <div
          class="w-full max-w-md aspect-[4/3] rounded-lg bg-white/10 flex items-center justify-center border border-white/20"
          aria-hidden="true"
        >
          <img
            src="@/assets/svg/login-box-bg.svg"
            alt=""
            class="w-full h-full object-contain"
          />
        </div>
      </div>

      <!-- 底部文案 -->
      <div class="pb-8 pt-4 px-6 text-center">
        <p class="text-lg font-bold uppercase tracking-wider">MGR SYSTEM</p>
        <p class="mt-2 text-white/80 text-sm">
          {{ $t("login.welcome") }}
        </p>
      </div>
    </aside>

    <!-- 右侧：登录区 -->
    <main
      class="flex-1 min-h-screen flex flex-col bg-white dark:bg-gray-900 px-4 sm:px-6"
    >
      <!-- 右上角：主题 / 语言 -->
      <div
        class="flex items-center justify-end gap-2 pt-4 pb-2 sm:pt-6 sm:pb-4 shrink-0"
      >
        <CommonThemeToggle />
        <CommonLanguageToggle />
      </div>

      <!-- 登录表单居中 -->
      <div class="flex-1 flex items-center justify-center py-8">
        <div class="w-full max-w-[400px]">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t("login.title") }}
            </h1>
          </div>

          <el-form
            ref="formRef"
            :model="loginForm"
            :rules="rules"
            @keyup.enter="openCaptchaAndLogin"
          >
            <el-form-item prop="tenantName">
              <el-input
                v-model="loginForm.tenantName"
                :placeholder="$t('login.tenantName')"
                size="large"
                clearable
              >
                <template #prefix>
                  <el-icon><OfficeBuilding /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                :placeholder="$t('login.username')"
                size="large"
                clearable
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                :placeholder="$t('login.password')"
                size="large"
                show-password
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <div class="flex items-center justify-between w-full">
                <el-checkbox v-model="loginForm.rememberMe">
                  {{ $t("login.rememberMe") }}
                </el-checkbox>
                <el-button link type="primary">
                  {{ $t("login.forgotPassword") }}
                </el-button>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                class="w-full"
                @click="openCaptchaAndLogin"
              >
                {{ loading ? $t("login.logging") : $t("login.loginBtn") }}
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 图形验证码弹窗：通过后提交登录 -->
          <el-dialog
            v-model="showCaptchaDialog"
            title="安全验证"
            width="360px"
            :close-on-click-modal="false"
            destroy-on-close
            @closed="onCaptchaDialogClosed"
          >
            <LoginCaptchaWrap
              v-if="showCaptchaDialog"
              ref="captchaWrapRef"
              :initial-captcha="preloadedCaptcha ?? undefined"
              @success="onCaptchaSuccess"
              @close="showCaptchaDialog = false"
            />
          </el-dialog>

          <el-alert type="info" :closable="false" class="mt-4">
            <template #title>
              <div class="text-sm">
                <p class="font-semibold mb-1">测试账号：</p>
                <p>管理员：admin / 123456</p>
                <p>普通用户：user / 123456</p>
              </div>
            </template>
          </el-alert>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

import { User, Lock, OfficeBuilding } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import type { LoginParams } from "@/types/user";
import { GetCode, GetTenantIdByName, SubmitLogin } from "@/api/login";
import type { GetCodeResult } from "@/api/login/type";
import LoginCaptchaWrap from "./_plugs/LoginCaptchaWrap.vue";

const { t } = useI18n(); // 国际化
const userStore = useUserStore(); // 用户商店
const router = useRouter(); // 路由
const route = useRoute(); // 当前路由

const loginForm = reactive<LoginParams>({
  tenantName: "creditnow",
  username: "admin",
  password: "admin123",
  rememberMe: true,
});

const formRef = ref<FormInstance>();

const required = (key: "tenantNameRequired" | "usernameRequired" | "passwordRequired") => ({
  required: true,
  message: t(`login.${key}`),
  trigger: "blur",
});

const LoginRules: FormRules = {
  tenantName: [required("tenantNameRequired")],
  username: [
    required("usernameRequired"),
    { min: 3, message: t("login.usernameLength"), trigger: "blur" },
  ],
  password: [
    required("passwordRequired"),
    { min: 6, message: t("login.passwordLength"), trigger: "blur" },
  ],
};

const rules = LoginRules;

const loading = ref(false);
const showCaptchaDialog = ref(false);
const captchaWrapRef = ref<InstanceType<typeof LoginCaptchaWrap> | null>(null);

/** 预加载的验证码数据，打开弹窗时直接使用，避免点击登录后再请求导致图片加载慢 */
const preloadedCaptcha = ref<GetCodeResult["repData"] | null>(null);

/** 预拉取图形验证码（页面进入时、弹窗关闭后各调用一次） */
const fetchCaptcha = async () => {
  try {
    const res = await GetCode({ captchaType: "blockPuzzle" });
    if (res.repCode === "0000" && res.repData) preloadedCaptcha.value = res.repData;
  } catch {
    // 静默失败，弹窗内仍会按需请求
  }
};

/** 点击登录：先校验表单，再弹出图形验证码 */
const openCaptchaAndLogin = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  showCaptchaDialog.value = true;
};

/** 图形验证通过后提交登录（先根据租户名解析 tenantId，再提交） */
const onCaptchaSuccess = async (payload: { captchaVerification: string }) => {
  loading.value = true;
  try {
    const tenantId = await GetTenantIdByName(loginForm.tenantName.trim());
    userStore.tenantId = tenantId; // 先存 store，请求拦截器才能给登录接口带上 tenant-id 头
    const result = await SubmitLogin({
      ...loginForm,
      captchaVerification: payload.captchaVerification,
    });
    userStore.setLoginResult(result, loginForm.rememberMe, tenantId);
    await userStore.getUserInfo(); // 拉取用户信息，供首页/布局展示
    ElMessage.success(t("login.successTip"));
    showCaptchaDialog.value = false;
    const redirect = (route.query.redirect as string) || "/";
    await router.push(redirect);
  } catch (e: any) {
    const msg = e?.data?.msg ?? e?.message ?? t("login.tenantNotFound");
    ElMessage.error(msg);
  } finally {
    loading.value = false;
  }
};

const onCaptchaDialogClosed = () => {
  captchaWrapRef.value = null;
  fetchCaptcha(); // 弹窗关闭后预拉取下一次验证码
};

onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push("/");
  } else {
    fetchCaptcha(); // 进入登录页即预拉取验证码，打开弹窗时图片已就绪
  }
});
</script>
