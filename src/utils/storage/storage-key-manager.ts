import { StorageConfig } from "./storage-config";

/**
 * 存储键名管理器（静态工具类）
 *
 * @description
 * 提供智能的版本化存储键管理和自动数据迁移功能。当应用版本升级时，
 * 自动检测旧版本数据并迁移到新版本键名下，确保用户数据无缝过渡。
 *
 * ## 核心功能
 * 1. **自动版本检测** - 检查当前版本的存储键是否存在数据
 * 2. **智能数据迁移** - 自动从旧版本键迁移数据到新版本键
 * 3. **透明化处理** - 对外提供统一接口，内部处理版本兼容逻辑
 * 4. **安全清理** - 迁移成功后自动删除旧版本数据，避免冗余
 *
 * ## 迁移策略
 * - 优先使用当前版本的数据
 * - 当前版本无数据时，查找任意历史版本的同名数据
 * - 找到历史数据后，复制到当前版本并删除旧数据
 * - 迁移失败时记录警告并清理损坏的旧数据
 *
 * @remarks
 * - 采用静态方法设计（无状态、无需实例化、更好的 Tree-shaking）
 * - 仅支持 localStorage，迁移过程是同步的
 * - 控制台日志前缀为 `[Storage]`
 */
export class StorageKeyManager {
  /**
   * 查找其他版本的同名存储键
   * @description 遍历 localStorage 匹配指定 storeId 的任意版本存储键，返回第一个有效键
   * @param storeId - 存储标识符（如 "user-info"）
   * @returns 找到的第一个存储键，未找到返回 `null`
   * @private
   */
  private static findExistingKey(storeId: string): string | null {
    const storageKeys = Object.keys(localStorage);
    const pattern = StorageConfig.createKeyPattern(storeId);

    return (
      storageKeys.find(
        (key) => pattern.test(key) && localStorage.getItem(key)
      ) || null
    );
  }

  /**
   * 检查当前版本的数据是否存在
   * @description 检查指定存储键在 localStorage 中是否存在且有值
   * @param key - 完整的存储键名
   * @returns 键存在且有值返回 `true`，否则返回 `false`
   * @private
   */
  private static hasCurrentVersionData(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * 将数据从旧版本迁移到当前版本
   * @description 从旧版本键读取数据，写入到新版本键，然后删除旧键（失败时也删除旧键防止污染）
   * @param fromKey - 旧版本的存储键
   * @param toKey - 当前版本的存储键
   * @private
   */
  private static migrateData(fromKey: string, toKey: string): void {
    try {
      const existingData = localStorage.getItem(fromKey);
      if (existingData) {
        localStorage.setItem(toKey, existingData);
        console.info(`[Storage] 已迁移数据: ${fromKey} → ${toKey}`);
        localStorage.removeItem(fromKey);
      }
    } catch (error) {
      console.warn(`[Storage] 数据迁移失败: ${fromKey}`, error);
      localStorage.removeItem(fromKey);
    }
  }

  /**
   * 获取持久化存储的键名（支持自动数据迁移）
   * @description 提供智能的存储键获取逻辑，自动检测并迁移旧版本数据到当前版本（对调用方透明）
   * @param storeId - 存储标识符（如 "user-info"、"app-settings"）
   * @returns 当前版本的完整存储键名（格式: `sys-v{版本}-{storeId}`）
   * @remarks
   * - 当前版本有数据时仅 1 次读取（O(1)），需迁移时遍历所有键（O(n)）
   * - 迁移只发生一次，后续访问走快速路径
   * - 多次调用同一 storeId 返回相同结果（幂等性）
   */
  static getStorageKey(storeId: string): string {
    const currentKey = StorageConfig.generateStorageKey(storeId);

    // 快速路径: 当前版本数据存在，直接返回
    if (this.hasCurrentVersionData(currentKey)) {
      return currentKey;
    }

    // 慢速路径: 查找并迁移旧版本数据
    const existingKey = this.findExistingKey(storeId);
    if (existingKey) {
      this.migrateData(existingKey, currentKey);
    }

    return currentKey;
  }

  /**
   * 批量迁移所有旧版本数据到当前版本
   * @description 一次性扫描并迁移 localStorage 中所有旧版本存储数据（通常在应用启动时调用）
   * @remarks
   * - 时间复杂度 O(n)，建议在应用启动早期调用
   * - 多次调用安全（幂等性），单个键失败不影响其他键
   * - 无效或损坏的键会被自动删除
   */
  static migrateAllData(): void {
    const versionPattern = StorageConfig.createVersionPattern();
    const currentVersionPattern = StorageConfig.createCurrentVersionPattern();
    const storageKeys = Object.keys(localStorage);

    // 筛选出所有旧版本的存储键（排除当前版本）
    const oldVersionKeys = storageKeys.filter(
      (key) => versionPattern.test(key) && !currentVersionPattern.test(key)
    );

    // 遍历每个旧版本键，提取 storeId 并迁移
    oldVersionKeys.forEach((oldKey) => {
      const storeId = StorageConfig.extractStoreIdFromKey(oldKey);
      if (storeId) {
        const currentKey = StorageConfig.generateStorageKey(storeId);
        this.migrateData(oldKey, currentKey);
      } else {
        console.warn(`[Storage] 无效的存储键格式，已删除: ${oldKey}`);
        localStorage.removeItem(oldKey);
      }
    });

    if (oldVersionKeys.length > 0) {
      console.info(
        `[Storage] 批量迁移完成，共处理 ${oldVersionKeys.length} 个旧版本键`
      );
    }
  }
}
