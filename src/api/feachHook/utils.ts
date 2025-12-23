interface CacheData<TData> {
  data: TData;
  timestamp: number;
}

/**
 * 缓存清单 Key
 * 用于记录所有被管理的缓存 Key，以便在初始化时批量恢复
 */
const CACHE_MANIFEST_KEY = '__REQ_CACHE_MANIFEST__';

/**
 * 内存缓存 Map
 * 运行时主要使用此 Map，localStorage 仅作为持久化备份
 */
const cacheMap = new Map<string, CacheData<any>>();

/**
 * 缓存清单 Set
 * 内存中的清单副本，减少 localStorage 读取
 */
let manifestSet: Set<string> = new Set();

/**
 * 初始化：从 localStorage 恢复所有缓存到内存
 *
 * @description
 * 1. 读取 Manifest 获取所有 Key
 * 2. 遍历 Key，读取 localStorage 数据并恢复到 memory
 * 3. 自动清理无效或损坏的数据
 */
function initCacheFromStorage() {
  try {
    const rawManifest = localStorage.getItem(CACHE_MANIFEST_KEY);
    if (rawManifest) {
      const keys = JSON.parse(rawManifest);
      if (Array.isArray(keys)) {
        manifestSet = new Set(keys);
      }
    }
    // oxlint-disable-next-line no-unused-vars
  } catch (error) {
    manifestSet = new Set();
  }

  // 遍历恢复
  const keysToRemove: string[] = [];
  manifestSet.forEach(key => {
    const rawData = localStorage.getItem(key);
    if (!rawData) {
      keysToRemove.push(key);
      return;
    }

    try {
      const cached: CacheData<any> = JSON.parse(rawData);
      // 恢复到内存 (此时不检查过期，get 时再检查，或者这里也可以预先检查)
      cacheMap.set(key, cached);
      // oxlint-disable-next-line no-unused-vars
    } catch (error) {
      keysToRemove.push(key);
    }
  });

  // 清理无效 Key
  if (keysToRemove.length > 0) {
    keysToRemove.forEach(k => {
      manifestSet.delete(k);
      localStorage.removeItem(k); // 同时也尝试清理数据（虽然数据可能本来就不存在）
    });
    saveManifest();
  }
}

/**
 * 保存 Manifest 到 localStorage
 */
function saveManifest() {
  try {
    localStorage.setItem(CACHE_MANIFEST_KEY, JSON.stringify(Array.from(manifestSet)));
    // oxlint-disable-next-line no-unused-vars
  } catch (error) {}
}

// 模块加载时自动初始化
initCacheFromStorage();

/**
 * 获取缓存数据
 *
 * @template TData - 返回的数据类型
 * @param key - 缓存键名
 * @param cacheTime - 缓存有效期（毫秒），-1 表示不过期
 * @returns 缓存的数据，如果不存在或已过期则返回 undefined
 */
export function getCache<TData>(key: string, cacheTime: number): TData | undefined {
  // 直接从内存读取（初始化时已同步）
  const cached = cacheMap.get(key);
  if (!cached) return undefined;

  // 检查是否过期
  if (cacheTime !== -1 && Date.now() - cached.timestamp > cacheTime) {
    // 过期：双删
    deleteCache(key);
    return undefined;
  }

  return cached.data;
}

/**
 * 设置缓存
 *
 * @template TData - 缓存数据的类型
 * @param key - 缓存键名
 * @param data - 要缓存的数据
 */
export function setCache<TData>(key: string, data: TData): void {
  const cacheData: CacheData<TData> = {
    data,
    timestamp: Date.now()
  };

  // 1. 更新内存
  cacheMap.set(key, cacheData);

  // 2. 同步到 localStorage
  try {
    localStorage.setItem(key, JSON.stringify(cacheData));

    // 3. 更新 Manifest (如果 Key 是新的)
    if (!manifestSet.has(key)) {
      manifestSet.add(key);
      saveManifest();
    }
    // oxlint-disable-next-line no-unused-vars
  } catch (e) {}
}

/**
 * 删除指定缓存
 *
 * @param key - 缓存键名
 */
export function deleteCache(key: string): void {
  // 1. 删除内存
  cacheMap.delete(key);

  // 2. 删除 localStorage
  localStorage.removeItem(key);

  // 3. 更新 Manifest
  if (manifestSet.has(key)) {
    manifestSet.delete(key);
    saveManifest();
  }
}

/**
 * 清空所有缓存
 *
 * @description
 * 根据 Manifest 清空所有受管理的缓存数据
 */
export function clearCache(): void {
  // 1. 遍历 Manifest 清理 localStorage
  manifestSet.forEach(key => {
    localStorage.removeItem(key);
  });

  // 2. 清理 Manifest 自身
  localStorage.removeItem(CACHE_MANIFEST_KEY);

  // 3. 重置状态
  manifestSet.clear();
  cacheMap.clear();
}

/**
 * 获取缓存时间戳
 *
 * @param key - 缓存键名
 * @returns 时间戳，如果不存在返回 undefined
 */
export function getCacheTimestamp(key: string): number | undefined {
  return cacheMap.get(key)?.timestamp;
}

/**
 * 判断是否为函数
 */
export function isFunction(val: unknown): val is (...args: any[]) => any {
  return typeof val === 'function';
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, wait);
  } as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, wait: number): T & { cancel: () => void } {
  let lastTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  } as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastTime = 0;
  };

  return throttled;
}
