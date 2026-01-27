/**
 * @file src/api/utils/index.ts
 * @description 核心请求类封装 (FetchRequest)
 *
 * 核心功能：
 * 1. 基于原生 fetch API 封装
 * 2. 支持请求/响应拦截器链 (Interceptors)
 * 3. 自动处理 URL 拼接、Query 参数序列化
 * 4. 自动处理 Body 序列化 (JSON)
 * 5. 支持超时控制与手动取消请求
 * 6. 统一的错误处理与类型支持
 */

import {
  ContentType,
  FetchClientError,
  type RequestConfig,
  type FetchInterceptors,
  type FetchResult
} from '@/api/feachHook/types';

class FetchRequest {
  private config: RequestConfig;
  private interceptors?: FetchInterceptors;

  constructor(config: RequestConfig, interceptors?: FetchInterceptors) {
    this.config = config;
    this.interceptors = interceptors;
  }

  /**
   * 安全请求方法（不抛出异常，返回 FetchResult）
   * 成功时返回 { data: T, error: null }
   * 失败时返回 { data: null, error: FetchClientError }
   *
   * @template T 响应数据类型
   * @param config 请求配置
   * @returns Promise<FetchResult<T>>
   */
  async safeRequest<T = any>(config: RequestConfig): Promise<FetchResult<T>> {
    try {
      const data = await this.request<T>(config);
      return { data, error: null, success: true };
    } catch (error) {
      const fetchError =
        error instanceof FetchClientError
          ? error
          : new FetchClientError('OTHER_ERROR', error instanceof Error ? error.message : '');
      return { data: null, error: fetchError, success: false };
    }
  }

  /**
   * 核心请求方法（会抛出异常）
   * @template T 响应数据类型
   * @param config 请求配置
   * @returns Promise<T>
   */
  async request<T = any>(config: RequestConfig): Promise<T> {
    // 1. 合并配置 & 执行请求拦截器
    const mergedConfig = this.invokeRequestInterceptors({
      ...this.config,
      ...config
    });

    // 2. 计算最终 URL
    const url = this.resolveUrl(mergedConfig);

    // 3. 处理 Body 序列化与 Headers
    this.resolveBodyAndHeaders(mergedConfig);

    // 4. 处理超时与取消控制
    const { controller, timeoutId } = this.createAbortController(mergedConfig);
    mergedConfig.signal = controller.signal;

    try {
      // 5. 发起请求
      const response = await fetch(url, mergedConfig);

      // 6. 执行响应拦截器链（无论 response.ok 是否为 true，都执行拦截器）
      // 这样拦截器可以根据 HTTP 状态码和业务错误码进行统一处理
      const processedResponse = await this.invokeResponseInterceptors(response);

      // 7. 如果拦截器没有抛出异常，且响应正常，解析 JSON
      if (processedResponse.ok) {
        return await processedResponse.json();
      } else {
        // 如果拦截器没有处理错误，使用默认错误处理
        throw await this.handleError(processedResponse, mergedConfig);
      }
    } catch (e) {
      if (e instanceof FetchClientError) {
        throw e;
      } else {
        throw new FetchClientError('OTHER_ERROR', e instanceof Error ? e.message : '');
      }
    } finally {
      // 清理超时定时器
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * 创建 AbortController，合并外部传入的 controller 与超时控制
   */
  private createAbortController(config: RequestConfig): {
    controller: AbortController;
    timeoutId: ReturnType<typeof setTimeout> | undefined;
  } {
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // 1. 处理超时
    if (config.timeout && config.timeout > 0) {
      timeoutId = setTimeout(() => {
        controller.abort(new FetchClientError('TIMEOUT_ERROR'));
      }, config.timeout);
    }

    // 2. 监听外部传入的 abortController
    if (config.abortController) {
      const externalSignal = config.abortController.signal;

      // 如果外部已经 abort，直接触发
      if (externalSignal.aborted) {
        controller.abort(externalSignal.reason);
      } else {
        // 监听外部 abort 事件，同步触发内部 controller
        externalSignal.addEventListener('abort', () => controller.abort(externalSignal.reason), { once: true });
      }
    }

    // 3. 兼容用户直接传入 signal（RequestInit 原生属性）
    if (config.signal) {
      const userSignal = config.signal;
      if (userSignal.aborted) {
        controller.abort(userSignal.reason);
      } else {
        userSignal.addEventListener('abort', () => controller.abort(userSignal.reason), { once: true });
      }
    }

    return { controller, timeoutId };
  }

  /**
   * 统一错误处理
   */
  private async handleError(errorResponse: Response, _: RequestConfig): Promise<Error> {
    try {
      const errorData = await errorResponse.json();
      if (errorResponse.status < 500) {
        return new FetchClientError('CLIENT_ERROR', errorData?.message ?? '');
      } else {
        return new FetchClientError('SERVER_ERROR');
      }
    } catch (error) {
      return new FetchClientError('OTHER_ERROR', error instanceof Error ? error.message : '');
    }
  }

  /**
   * 执行请求拦截器链
   */
  private invokeRequestInterceptors(config: RequestConfig): RequestConfig {
    let processedConfig = config;
    if (this.interceptors?.requestInterceptors) {
      this.interceptors.requestInterceptors.forEach(interceptor => {
        processedConfig = interceptor(processedConfig);
      });
    }
    return processedConfig;
  }

  /**
   * 执行响应拦截器链
   */
  private async invokeResponseInterceptors(response: Response): Promise<Response> {
    // 链式执行拦截器
    let result: Response = response;
    for (const interceptor of this.interceptors?.responseInterceptors ?? []) {
      result = await interceptor(result);
    }
    return result;
  }

  /**
   * 解析最终请求 URL（处理 baseURL, path, params）
   */
  private resolveUrl(config: RequestConfig): URL {
    let url: URL;
    const { url: path, baseURL, params } = config;

    // 1. 基础路径拼接
    if (path?.startsWith('http')) {
      url = new URL(path);
    } else {
      // 确保 baseURL 存在，否则默认为当前域
      const base = baseURL || window.location.origin;
      // 处理路径拼接时的斜杠问题，URL 构造函数会自动处理，但需注意 base 必须是绝对路径
      url = new URL(path || '', base);
    }

    // 2. Query 参数处理
    if (params) {
      const searchParams = new URLSearchParams(url.search); // 保留原有 query
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url.search = searchParams.toString();
    }

    return url;
  }

  /**
   * 处理请求头与 Body 序列化
   * 修改引用，直接更新 config 对象
   */
  private resolveBodyAndHeaders(config: RequestConfig): void {
    // 优先使用 data，兼容 body（若用户直接传了 body 且未传 data）
    const rawData = config.data ?? config.body;

    // 如果没有数据，直接返回（GET 请求等）
    if (rawData === undefined || rawData === null) {
      return;
    }

    // 初始化 headers
    if (!config.headers) {
      config.headers = {};
    }

    // 智能推断并序列化
    const contentType = config.headers['Content-Type'];

    // 1. JSON (默认)
    if (!contentType || contentType === ContentType.APPLICATION_JSON) {
      config.headers['Content-Type'] = ContentType.APPLICATION_JSON;
      config.body = JSON.stringify(rawData);
    }
    // 2. Form Data (原生 FormData 对象)
    else if (rawData instanceof FormData) {
      // 浏览器会自动设置 Content-Type 为 multipart/form-data; boundary=...
      // 因此必须移除手动设置的 Content-Type
      delete config.headers['Content-Type'];
      config.body = rawData;
    }
    // 3. URL Encoded
    else if (contentType === ContentType.APPLICATION_X_WWW_FORM_URLENCODED) {
      config.body = new URLSearchParams(rawData).toString();
    }
    // 4. 其他情况（如 text/plain 或已序列化的数据）
    else {
      config.body = rawData;
    }
  }
}

export default FetchRequest;
