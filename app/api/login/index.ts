import { http } from "@/utils/http";
import type { LoginParams } from "@/types/user";
import type { LoginResult } from "@/types/user";
import type { GetCodeParams, GetCodeResult, ReqCheckParams, ReqCheckResult } from "./type";
import type { GetPermissionInfoResult } from "@/api/user/type";

/** 提交登录（需先通过图形验证，传入 captcha 字段） */
export const SubmitLogin = (data: LoginParams) => {
  return http.post<LoginResult>("/system/auth/login", data);
};

/** 获取验证图片 */
export const GetCode = (data: GetCodeParams) => {
  return http.postOriginal<GetCodeResult>("/system/captcha/get", data);
};

/** 滑动或点选验证 */
export const ReqCheck = (data: ReqCheckParams) => {
  return http.postOriginal<ReqCheckResult>("/system/captcha/check", data);
}

/** 根据租户名获取租户编号（登录前先解析 tenantId） */
export const GetTenantIdByName = (name: string):Promise<number> => {
  return http.get<number>(
    "/system/tenant/get-id-by-name",
    { name }
  );
};

/** 获取当前用户/权限信息（用于登录后或刷新后恢复用户信息） */
export const GetInfo = () => {
  return http.get<any>("/system/auth/get-permission-info");
};

/**
 * ✅ 获取用户权限信息（SSR + CSR，使用 useFetch）
 */
export const useGetInfo = () => {
  return useApiData<GetPermissionInfoResult>('/system/auth/get-permission-info', {
    method: 'GET',
    // ✅ SSR 配置
    server: true,  // 服务端执行
    lazy: false,   // 立即执行
    immediate: true, // 立即执行
  })
}
/** 退出登录 */
export const Logout = () => {
  return http.post("/system/auth/logout");
};
