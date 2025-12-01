/**
 * @file src/api/utils/types.ts
 * @description 请求相关的类型定义
 * 包含：
 * - ContentType: 常用 Content-Type 枚举
 * - RequestConfig: 请求配置接口，继承自 RequestInit
 * - RequestInterceptors: 拦截器接口
 * - Result: 通用后端响应结构
 */

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestConfig extends RequestInit {
  baseURL?: string;
  url?: string;
  method?: Method;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  /**
   * 请求体原始数据
   * 建议使用 data 传递对象数据，body 留给底层 fetch 使用（或由 data 转换而来）
   */
  data?: any;
  /**
   * 请求超时时间（毫秒），默认不超时
   */
  timeout?: number;
  /**
   * 外部传入的 AbortController，用于手动取消请求
   * 与 timeout 可同时使用，任意一个触发都会取消请求
   */
  abortController?: AbortController;
  // 标记是否需要 token，默认为 true，可以在 specific request 中覆盖
  needToken?: boolean;
}

/**
 * 请求拦截器
 */
export interface FetchInterceptors {
  // 请求拦截器
  requestInterceptors?: ((config: RequestConfig) => RequestConfig)[];
  // 响应拦截器
  responseInterceptors?: ((res: Response) => Promise<Response> | Response)[];
}

/**
 * 错误类型：FetchClientErrorType
 * 表示 fetch 客户端可能出现的错误类型
 * 使用联合类型以兼容 'erasableSyntaxOnly' 配置
 */
export type FetchClientErrorType =
  | "NETWORK_ERROR"
  | "SERVER_ERROR"
  | "TIMEOUT_ERROR"
  | "ABORT_ERROR"
  | "SECURITY_ERROR"
  | "OTHER_ERROR";
/**
 * 请求客户端错误
 */
export class FetchClientError extends Error {
  constructor(
    type: FetchClientErrorType,
    message: string = type.toLowerCase()
  ) {
    super(message);
    this.name = type.toLowerCase();
    this.type = type;
  }
  public readonly type: FetchClientErrorType;
}

/**
 * 内容类型枚举，用于设置请求头中的 Content-Type
 */
export const ContentType = {
  APPLICATION_JSON: "application/json",
  APPLICATION_X_WWW_FORM_URLENCODED: "application/x-www-form-urlencoded",
  MULTIPART_FORM_DATA: "multipart/form-data",
  TEXT_PLAIN: "text/plain",
};

/**
 * 请求结果包装类型
 * 无论成功或失败都返回此结构，避免 try/catch
 *
 * 成功时: { data: T, error: null | undefined, success: true }
 * 失败时: { data: null, error: FetchClientError, success: false }
 */
export type FetchResult<T> =
  | { data: T; error: null | undefined; success: true }
  | { data: null; error: FetchClientError | undefined; success: false };
