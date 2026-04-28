import type { BaseDTO } from './baseDTO';

/**
 * 注册接口请求参数
 */
export interface RegisterParams {
  username: string;
  password: string;
  lang: string;
  captchaId: string;
  verifyCode: string;
}

/**
 * 注册接口响应类型
 * 成功返回 201，data 为空
 */
export type RegisterDTO = BaseDTO<null>;
