/**
 * 节流和防抖工具函数模块
 *
 * 提供高性能的节流和防抖函数，用于优化用户交互和API调用
 *
 * ## 主要功能
 *
 * - **节流 (Throttle)**: 在指定时间间隔内最多执行一次函数
 * - **防抖 (Debounce)**: 在指定时间间隔内只执行最后一次函数调用
 * - **类型安全**: 完整的 TypeScript 类型支持
 * - **灵活配置**: 支持立即执行、延迟执行等选项
 * - **清理功能**: 提供取消执行的方法
 *
 * ## 使用场景
 *
 * - 用户输入搜索防抖
 * - 窗口 resize 事件节流
 * - 按钮点击防抖（防止重复提交）
 * - 滚动事件节流
 * - API 请求频率控制
 *
 * ## 技术实现
 *
 * - 使用高精度定时器
 * - 支持取消和重置操作
 * - 内存安全的清理机制
 * - 优化的性能表现
 *
 * @module utils/function
 * @author Art Design Pro Team
 */

/**
 * 节流函数选项
 */
interface ThrottleOptions {
  /** 是否在开始时立即执行一次 */
  leading?: boolean;
  /** 是否在结束时执行最后一次 */
  trailing?: boolean;
}

/**
 * 防抖函数选项
 */
interface DebounceOptions {
  /** 是否在开始时立即执行一次 */
  leading?: boolean;
  /** 最大等待时间（超过此时间必须执行一次） */
  maxWait?: number;
}

/**
 * 节流函数返回值类型
 */
interface ThrottledFunction<T extends (...args: any[]) => any> {
  /** 节流后的函数 */
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** 取消当前延迟执行 */
  cancel: () => void;
  /** 立即执行一次（如果有等待中的调用） */
  flush: () => ReturnType<T> | undefined;
  /** 是否有等待中的调用 */
  pending: () => boolean;
}

/**
 * 防抖函数返回值类型
 */
interface DebouncedFunction<T extends (...args: any[]) => any> {
  /** 防抖后的函数 */
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** 取消当前延迟执行 */
  cancel: () => void;
  /** 立即执行一次（如果有等待中的调用） */
  flush: () => ReturnType<T> | undefined;
  /** 是否有等待中的调用 */
  pending: () => boolean;
}

/**
 * 创建节流函数
 *
 * 在指定时间间隔内最多执行一次函数。
 * 适用于需要限制执行频率的场景，如滚动事件、窗口resize等。
 *
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @param options 节流选项
 * @returns 节流后的函数
 *
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event');
 * }, 100);
 *
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: ThrottleOptions = {}
): ThrottledFunction<T> {
  const { leading = true, trailing = true } = options;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let result: ReturnType<T> | undefined;

  function clearTimer() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function invokeFunc(time: number) {
    const args = lastArgs!;
    const thisArg = lastThis!;

    lastArgs = null;
    lastThis = null;
    lastExecTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time: number) {
    lastExecTime = time;
    timeoutId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - lastExecTime;
    const timeWaiting = wait - timeSinceLastCall;
    return timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - lastExecTime;
    return (
      lastExecTime === 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge();
    } else {
      timeoutId = setTimeout(timerExpired, remainingWait(time));
    }
  }

  function trailingEdge() {
    timeoutId = null;
    if (trailing && lastArgs) {
      invokeFunc(Date.now());
    }
  }

  function cancel() {
    clearTimer();
    lastExecTime = 0;
    lastArgs = null;
    lastThis = null;
  }

  function flush() {
    return timeoutId === null ? result : invokeFunc(Date.now());
  }

  function pending() {
    return timeoutId !== null;
  }

  function throttled(this: any, ...args: Parameters<T>) {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return leadingEdge(time);
    }

    // 存储最后一次调用的参数
    lastArgs = args;
    lastThis = this;

    if (!timeoutId && trailing) {
      timeoutId = setTimeout(timerExpired, remainingWait(time));
    }

    return result;
  }

  throttled.cancel = cancel;
  throttled.flush = flush;
  throttled.pending = pending;

  return throttled;
}

/**
 * 创建防抖函数
 *
 * 在指定时间间隔内只执行最后一次函数调用。
 * 适用于需要延迟执行的场景，如搜索输入、窗口resize后的重新计算等。
 *
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param options 防抖选项
 * @returns 防抖后的函数
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * input.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value);
 * });
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  const { leading = false, maxWait } = options;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let maxTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let result: ReturnType<T> | undefined;

  function clearTimer() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (maxTimeoutId !== null) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = null;
    }
  }

  function invokeFunc(time: number) {
    const args = lastArgs!;
    const thisArg = lastThis!;

    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    const maxWaiting = maxWait ? maxWait - timeSinceLastInvoke : 0;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWaiting)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge();
    } else {
      timeoutId = setTimeout(timerExpired, remainingWait(time));
    }
  }

  function trailingEdge() {
    timeoutId = null;
    if (lastArgs) {
      invokeFunc(Date.now());
    }
    if (maxTimeoutId !== null) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = null;
    }
  }

  function cancel() {
    clearTimer();
    lastInvokeTime = 0;
    lastArgs = null;
    lastCallTime = undefined;
    lastThis = null;
  }

  function flush() {
    return timeoutId === null ? result : invokeFunc(Date.now());
  }

  function pending() {
    return timeoutId !== null;
  }

  function debounced(this: any, ...args: Parameters<T>) {
    const time = Date.now();
    lastCallTime = time;

    // 存储最后一次调用的参数
    lastArgs = args;
    lastThis = this;

    if (shouldInvoke(time)) {
      return leadingEdge(time);
    }

    // 设置最大等待时间定时器
    if (maxWait !== undefined && !maxTimeoutId) {
      maxTimeoutId = setTimeout(() => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        trailingEdge();
      }, maxWait);
    }

    // 设置普通定时器
    if (!timeoutId) {
      timeoutId = setTimeout(timerExpired, remainingWait(time));
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}

/**
 * 简化的节流函数
 *
 * 提供最常用的节流功能，默认配置适合大多数场景。
 *
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @returns 节流后的函数
 *
 * @example
 * ```typescript
 * const throttledClick = throttleSimple(() => {
 *   console.log('Button clicked');
 * }, 300);
 * ```
 */
export function throttleSimple<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ThrottledFunction<T> {
  return throttle(func, wait, { leading: true, trailing: true });
}

/**
 * 简化的防抖函数
 *
 * 提供最常用的防抖功能，默认配置适合大多数场景。
 *
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 *
 * @example
 * ```typescript
 * const debouncedInput = debounceSimple((value: string) => {
 *   console.log('Input value:', value);
 * }, 300);
 * ```
 */
export function debounceSimple<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  return debounce(func, wait, { leading: false });
}

/**
 * 延迟执行函数
 *
 * 在指定时间后执行一次函数，类似于防抖但只执行一次。
 *
 * @param func 要延迟执行的函数
 * @param wait 等待时间（毫秒）
 * @returns 延迟执行的函数
 *
 * @example
 * ```typescript
 * const delayedLog = delay(() => {
 *   console.log('Executed after delay');
 * }, 1000);
 *
 * delayedLog(); // 1秒后执行
 * ```
 */
export function delay<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, wait);
  };
}

/**
 * 创建可配置的节流/防抖函数
 *
 * 根据传入的配置自动选择节流或防抖策略。
 */
export interface ThrottleDebounceConfig {
  /** 等待时间（毫秒） */
  wait: number;
  /** 是否使用节流（true）还是防抖（false） */
  throttle?: boolean;
  /** 节流选项（仅在 throttle=true 时有效） */
  throttleOptions?: ThrottleOptions;
  /** 防抖选项（仅在 throttle=false 时有效） */
  debounceOptions?: DebounceOptions;
}

export function createThrottleDebounce<T extends (...args: any[]) => any>(
  func: T,
  config: ThrottleDebounceConfig
): ThrottledFunction<T> | DebouncedFunction<T> {
  const {
    wait,
    throttle: useThrottle = false,
    throttleOptions,
    debounceOptions,
  } = config;

  if (useThrottle) {
    return throttle(func, wait, throttleOptions);
  } else {
    return debounce(func, wait, debounceOptions);
  }
}
