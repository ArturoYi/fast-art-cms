import type { BaseDTO } from './baseDTO';

/**
 * 登录接口响应类型
 */
export interface LoginDTO extends BaseDTO<{
  token: string;
}> {}
