import { http } from '@/utils/http'
/** 获取当前用户/权限信息（用于登录后或刷新后恢复用户信息） */
export const GetInfo = () => {
    return http.get<any>("/system/auth/get-permission-info");
  };
  