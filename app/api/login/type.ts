// 获取图形验证码 - 入参
export interface GetCodeParams {
  captchaType: string
}

// 获取图形验证码 - 返回（原始响应，非标准 code/msg/data）
export interface GetCodeResult {
  repCode: string
  repData?: {
    originalImageBase64: string
    jigsawImageBase64: string
    token: string
    secretKey: string
    /** 缺口在图片中的 y 坐标（与校验时 pointJson 的 y 一致），不传则用默认 5 */
    jigsawY?: number
  }
  repMsg?: string
}

// 滑动/点选验证 - 入参
export interface ReqCheckParams {
  captchaType: string
  pointJson: string
  token: string
}

// 滑动/点选验证 - 返回
export interface ReqCheckResult {
  repCode: string
  repData?: unknown
  repMsg?: string
}


