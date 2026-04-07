import type { BaseDTO } from './baseDTO';

/**
 * 登录接口响应类型
 */
export interface LoginDTO extends BaseDTO<{
  token: string;
}> {}

/** GET /api/auth/captcha 响应 data 字段 */
export interface CaptchaPayload {
  captchaId: string;
  image: string;
  expiresIn: number;
}

export type CaptchaResponseDTO = BaseDTO<CaptchaPayload>;
