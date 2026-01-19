/**
 * @file src/api/client/DTO/baseDTO.ts
 * @description 接口响应基类定义
 *
 * 所有接口响应都遵循统一格式：
 * {
 *   code: number,      // 响应状态码
 *   message: string,   // 响应消息
 *   data: T           // 响应数据（泛型）
 * }
 */

/**
 * 接口响应基类
 * @template T 响应数据类型
 */
export interface BaseDTO<T = any> {
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T | null;
}
