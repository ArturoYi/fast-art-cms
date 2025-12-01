import type { Ref } from "vue";
import type { FetchClientError } from "../utils/types";

/**
 * 服务函数类型
 * @template TData 返回数据类型
 * @template TParams 参数类型元组
 */
export type Service<TData, TParams extends any[]> = (
  ...args: TParams
) => Promise<TData>;

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
