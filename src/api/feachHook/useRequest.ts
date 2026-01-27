import { FetchClientError, type Service, type UseRequestOptions, type UseRequestResult } from '@/api/feachHook/types';
import { onMounted, onUnmounted, ref, unref, watch, type Ref } from 'vue';
import { getCache, getCacheTimestamp, setCache, isFunction, debounce, throttle } from '@/api/feachHook/utils';

/**
 * 核心请求 Hook
 *
 * 处理异步请求的完整生命周期，包括：
 * - 状态管理 (loading, data, error)
 * - 竞态处理 (Race Condition)
 * - 缓存策略 (SWR)
 * - 错误重试
 * - 防抖/节流
 * - 依赖刷新与自动执行
 *
 * @template TData - 响应数据类型
 * @template TParams - 请求参数类型（元组/数组）
 * @param service - 返回 Promise 的异步请求函数
 * @param options - 配置项
 * @returns UseRequestResult - 包含响应数据、状态及执行方法的对象
 */
export function useRequest<TData, TParams extends any[] = []>(
  service: Service<TData, TParams>,
  options: UseRequestOptions<TData, TParams> = {}
): UseRequestResult<TData, TParams> {
  const {
    manual = false,
    defaultParams,
    initialData,
    retryCount = 0,
    retryInterval = 1000,
    cacheKey,
    cacheTime = 5 * 60 * 1000,
    staleTime = 0,
    debounceWait,
    throttleWait,
    loadingKeep,
    ready = true,
    refreshDeps,
    onBefore,
    onSuccess,
    onError,
    onFinally
  } = options;

  // ============ 响应式状态 (Reactive State) ============

  /** 响应数据，可设置初始值 */
  const data = ref<TData | undefined>(initialData) as Ref<TData | undefined>;

  /** 请求是否正在进行中 */
  const loading = ref(false);

  /** 请求产生的错误对象 */
  const error = ref<FetchClientError | undefined>();

  /** 当前最近一次请求使用的参数 */
  const params = ref<TParams | undefined>(defaultParams) as Ref<TParams | undefined>;

  // ============ 内部状态 (Internal State) ============

  /**
   * 请求计数器
   * 用于标识请求的唯一性，解决竞态问题（Discard Stale Responses）。
   * 每次发起新请求时自增，回调中对比闭包内的 count 与 currentCount 是否一致。
   */
  let currentCount = 0;

  /** 重试定时器引用，用于清除未执行的重试 */
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * 控制器实例
   * 用于标记和取消当前请求上下文（注意：需配合 service 支持 signal 才能真正取消网络请求）。
   */
  let abortController: AbortController | null = null;

  /**
   * 核心请求执行逻辑
   *
   * @param args - 请求参数
   * @param retryRemaining - 剩余重试次数
   */
  const fetchData = async (args: TParams, retryRemaining: number = retryCount): Promise<TData> => {
    const count = ++currentCount;

    // 1. 竞态处理：取消上一轮未完成的逻辑
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    // 2. 缓存策略检查 (Cache Strategy)
    // 优先返回有效缓存；若 staleTime 允许，则无需重新发起请求
    if (cacheKey) {
      const cachedData = getCache<TData>(cacheKey, cacheTime);
      if (cachedData !== undefined) {
        const cacheTimestamp = getCacheTimestamp(cacheKey);
        // 如果缓存未过期（在保鲜期内），直接使用缓存并返回，不发起网络请求
        if (cacheTimestamp && Date.now() - cacheTimestamp < staleTime) {
          data.value = cachedData;
          return cachedData;
        }
        // 如果缓存存在但已过保鲜期，先展示缓存数据（Stale-While-Revalidate），继续发起请求
        data.value = cachedData;
      }
    }

    // 更新请求状态
    loading.value = true;
    error.value = undefined;
    params.value = args;

    onBefore?.(args);

    const startTime = Date.now();

    try {
      // 执行服务函数
      const result = await service(...args);

      // 3. 竞态检查 (Race Condition Check)
      // 如果 count 不等于 currentCount，说明在 await 期间发起了新请求，当前结果已过时应丢弃
      if (count !== currentCount) {
        return result;
      }

      if (cacheKey) {
        setCache(cacheKey, result);
      }

      // loadingKeep 处理：如果请求时间少于 loadingKeep，则延迟剩余时间
      if (loadingKeep && loadingKeep > 0) {
        const remainingTime = loadingKeep - (Date.now() - startTime);
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
      }

      // 再次进行竞态检查，因为在 await loadingKeep 期间可能发起了新请求
      if (count !== currentCount) {
        return result;
      }

      // 更新成功状态与数据
      data.value = result;
      error.value = undefined;

      onSuccess?.(result, args);
      return result;
    } catch (err) {
      // 竞态检查：忽略过时请求的错误
      if (count !== currentCount) {
        throw err;
      }

      const fetchError =
        err instanceof FetchClientError
          ? err
          : new FetchClientError('OTHER_ERROR', err instanceof Error ? err.message : '');
      error.value = fetchError;

      // 4. 错误重试机制 (Error Retry Mechanism)
      // 非手动取消且有剩余重试次数时，延迟后递归调用 fetchData
      if (retryRemaining > 0 && fetchError.type !== 'ABORT_ERROR') {
        return new Promise((resolve, reject) => {
          retryTimer = setTimeout(() => {
            fetchData(args, retryRemaining - 1)
              .then(resolve)
              .catch(reject);
          }, retryInterval);
        });
      }

      // loadingKeep 处理（仅在最后一次尝试失败时且不需要重试时）
      if (loadingKeep && loadingKeep > 0) {
        const remainingTime = loadingKeep - (Date.now() - startTime);
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
      }

      // 再次进行竞态检查
      if (count !== currentCount) {
        // 如果已经开启了新请求，当前错误不再处理（或者静默处理），抛出 abort 错误或原错误均可
        // 这里保持抛出原错误，但在 finally 中会根据 count 决定是否关闭 loading
        throw fetchError;
      }

      error.value = fetchError;
      onError?.(fetchError, args);
      throw fetchError;
    } finally {
      // 仅当当前请求是最新的请求时，才重置 loading 并触发 onFinally
      if (count === currentCount) {
        loading.value = false;
        onFinally?.(args, data.value, error.value);
      }
    }
  };

  // ============ 对外暴露的方法 (Exposed Methods) ============

  /**
   * 执行请求（安全模式）
   * 内部捕获异常，返回 Promise<Data | undefined>，适合在事件回调中使用，避免未捕获的 Promise 错误。
   */
  const run = async (...args: TParams): Promise<TData | undefined> => {
    try {
      return await fetchData(args);
    } catch {
      return undefined;
    }
  };

  /**
   * 执行请求（异步模式）
   * 发生错误时抛出异常，适合需要 try/catch 处理特定错误的场景。
   */
  const runAsync = async (...args: TParams): Promise<TData> => {
    return fetchData(args);
  };

  /**
   * 刷新请求
   * 使用上一次的参数重新发起请求（安全模式）。
   */
  const refresh = async (): Promise<TData | undefined> => {
    const currentParams = params.value ?? ([] as unknown as TParams);
    return run(...currentParams);
  };

  /**
   * 刷新请求（异步模式）
   * 使用上一次的参数重新发起请求，并抛出异常。
   */
  const refreshAsync = async (): Promise<TData> => {
    const currentParams = params.value ?? ([] as unknown as TParams);
    return runAsync(...currentParams);
  };

  /**
   * 取消当前请求
   * 中断重试定时器，增加计数器以丢弃进行中的请求结果，重置 loading 状态。
   */
  const cancel = (): void => {
    currentCount++; // 这里的自增是为了让正在进行的 fetch 回调检测到 id 不匹配从而丢弃结果
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    loading.value = false;
  };

  /**
   * 乐观更新 (Optimistic Update)
   * 手动修改 data 值而不触发请求，支持传入新值或更新函数。
   */
  const mutate = (newData: TData | ((oldData?: TData) => TData)): void => {
    if (isFunction(newData)) {
      data.value = newData(data.value);
    } else {
      data.value = newData;
    }
  };

  // ============ 包装防抖/节流 (Debounce/Throttle Wrapper) ============

  let wrappedRun = run;
  if (debounceWait && debounceWait > 0) {
    wrappedRun = debounce(run, debounceWait);
  } else if (throttleWait && throttleWait > 0) {
    wrappedRun = throttle(run, throttleWait);
  }

  // ============ 生命周期 (Lifecycle) ============

  // 挂载时自动执行（非手动模式）
  onMounted(() => {
    if (!manual) {
      const initParams = defaultParams ?? ([] as unknown as TParams);
      run(...initParams);
    }
  });

  // 卸载时清理副作用
  onUnmounted(() => {
    cancel();
  });

  // ============ 依赖监听 (Watchers) ============

  // 监听依赖列表变化自动刷新
  if (refreshDeps && refreshDeps.length > 0) {
    watch(refreshDeps, () => {
      const isReady = unref(ready);
      if (isReady) {
        refresh();
      }
    });
  }

  // 监听 ready 状态变化：从 false 变为 true 时自动触发请求
  if (typeof ready !== 'boolean') {
    watch(ready, newVal => {
      if (newVal && !manual) {
        const initParams = defaultParams ?? ([] as unknown as TParams);
        run(...initParams);
      }
    });
  }

  return {
    data,
    loading,
    error,
    params,
    run: wrappedRun,
    runAsync,
    refresh,
    refreshAsync,
    cancel,
    mutate
  };
}
