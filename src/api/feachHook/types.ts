import type { Ref } from 'vue';
import { $t } from '@/locale';
import { showErrorMessage, showWarningMessage } from '@/utils/message';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

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
  | 'CLIENT_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'TIMEOUT_ERROR'
  | 'ABORT_ERROR'
  | 'SECURITY_ERROR'
  | 'OTHER_ERROR'
  | 'HANDLED_ERROR'; // 错误已在拦截器处理，业务处不需要处理错误和提示用户
/**
 * 请求客户端错误
 */
export class FetchClientError extends Error {
  constructor(type: FetchClientErrorType, message: string = '') {
    super(message);
    this.name = type.toLowerCase();
    this.type = type;
  }
  public readonly type: FetchClientErrorType;

  public text(): string {
    if (this.message) {
      return this.message;
    }
    switch (this.type) {
      case 'CLIENT_ERROR':
        return $t('error.clientError');
      case 'NETWORK_ERROR':
        return $t('error.networkError');
      case 'SERVER_ERROR':
        return $t('error.serverError');
      case 'TIMEOUT_ERROR':
        return $t('error.timeoutError');
      case 'ABORT_ERROR':
        return $t('error.abortError');
      case 'SECURITY_ERROR':
        return $t('error.securityError');
      case 'OTHER_ERROR':
        return $t('error.otherError');
      case 'HANDLED_ERROR':
        // 错误已在拦截器处理，返回空字符串，业务处不需要再次提示
        return '';
      default:
        return $t('error.networkError');
    }
  }

  /**
   * 使用 NaiveUI 显示错误消息
   * @param duration 消息显示时长（毫秒），默认不设置（使用 NaiveUI 默认值）
   */
  public showMessage(duration?: number): void {
    // HANDLED_ERROR 类型已在拦截器处理，不需要再次显示
    if (this.type === 'HANDLED_ERROR') {
      return;
    }
    const messageText = this.text();
    if (!messageText) {
      return;
    }
    // 根据错误类型选择不同的消息类型
    switch (this.type) {
      case 'CLIENT_ERROR':
      case 'NETWORK_ERROR':
      case 'SERVER_ERROR':
      case 'TIMEOUT_ERROR':
      case 'SECURITY_ERROR':
      case 'OTHER_ERROR':
        // 这些错误类型使用错误消息
        showErrorMessage(messageText, duration);
        break;
      case 'ABORT_ERROR':
        // 取消请求使用警告消息
        showWarningMessage(messageText, duration);
        break;
      default:
        // 默认使用错误消息
        showErrorMessage(messageText, duration);
    }
  }
}

/**
 * 内容类型枚举，用于设置请求头中的 Content-Type
 */
export const ContentType = {
  APPLICATION_JSON: 'application/json',
  APPLICATION_X_WWW_FORM_URLENCODED: 'application/x-www-form-urlencoded',
  MULTIPART_FORM_DATA: 'multipart/form-data',
  TEXT_PLAIN: 'text/plain'
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
/**
 * 服务函数类型
 * @template TData 返回数据类型
 * @template TParams 参数类型元组
 */
export type Service<TData, TParams extends any[]> = (...args: TParams) => Promise<TData>;

/**
 * useRequest 配置选项
 */
export interface UseRequestOptions<TData, TParams extends any[]> {
  /**
   * 是否手动触发请求，默认 false（自动触发）
   */
  manual?: boolean;

  /**
   * 默认参数，自动请求时使用
   */
  defaultParams?: TParams;

  /**
   * 初始数据
   */
  initialData?: TData;

  /**
   * 错误重试次数，默认 0 不重试
   */
  retryCount?: number;

  /**
   * 重试间隔（毫秒），默认 1000
   */
  retryInterval?: number;

  // ============ 缓存 ============
  /**
   * 缓存 key，设置后开启缓存
   */
  cacheKey?: string;

  /**
   * 缓存时间（毫秒），默认 5 分钟，-1 表示永久
   */
  cacheTime?: number;

  /**
   * 数据新鲜时间（毫秒），在此时间内不重新请求
   */
  staleTime?: number;

  // ============ 防抖 & 节流 ============
  /**
   * 防抖等待时间（毫秒）
   */
  debounceWait?: number;

  /**
   * 节流等待时间（毫秒）
   */
  throttleWait?: number;

  /**
   * loading 持续时间（毫秒）
   * 如果请求时间少于指定的时间，则最终时间为指定的时间
   * 如果请求时间大于指定的时间，则最终时间为请求的时间
   */
  loadingKeep?: number;

  // ============ 生命周期 ============
  /**
   * 请求前回调
   */
  onBefore?: (params: TParams) => void;

  /**
   * 请求成功回调
   */
  onSuccess?: (data: TData, params: TParams) => void;

  /**
   * 请求失败回调
   */
  onError?: (error: FetchClientError, params: TParams) => void;

  /**
   * 请求结束回调（无论成功失败）
   */
  onFinally?: (params: TParams, data?: TData, error?: FetchClientError) => void;

  // ============ 并发控制 ============
  /**
   * 是否准备好发起请求，为 false 时不会发起请求
   */
  ready?: Ref<boolean> | boolean;

  /**
   * 依赖刷新，当依赖变化时自动重新请求
   */
  refreshDeps?: Ref<any>[];
}

/**
 * useRequest 返回结果
 * @template TData 返回数据类型
 * @template TParams 参数类型元组
 */
export interface UseRequestResult<TData, TParams extends any[]> {
  /**
   * 响应数据
   */
  data: Ref<TData | undefined>;

  /**
   * 加载状态
   */
  loading: Ref<boolean>;

  /**
   * 错误对象
   */
  error: Ref<FetchClientError | undefined>;

  /**
   * 当前请求参数
   */
  params: Ref<TParams | undefined>;

  /**
   * 手动触发请求
   */
  run: (...args: TParams) => Promise<TData | undefined>;

  /**
   * 手动触发请求（抛出异常版本）
   */
  runAsync: (...args: TParams) => Promise<TData>;

  /**
   * 使用上次参数刷新
   */
  refresh: () => Promise<TData | undefined>;

  /**
   * 使用上次参数刷新（抛出异常版本）
   */
  refreshAsync: () => Promise<TData>;

  /**
   * 取消请求
   */
  cancel: () => void;

  /**
   * 直接修改 data
   */
  mutate: (newData: TData | ((oldData?: TData) => TData)) => void;
}
