export class StorageConfig {
  /**
   * 当前应用版本
   * @description 从 Vite 全局常量 `__APP_VERSION__` 获取，用于生成版本化的存储键
   */
  private static readonly CURRENT_VERSION = __APP_VERSION__;

  /**
   * 判断是否是格式正确的存储键，不判断版本号是否一致
   * @description 用于分隔存储键的版本号和存储键
   */
  private static isVersionedKey(key: string): boolean {
    return key.startsWith(`${this.STORAGE_PREFIX}`);
  }

  /**
   * 判断是否是当前版本化的存储键
   * @param key 存储键
   * @description 用于判断是否是当前版本化的存储键
   * @returns 是否是当前版本化的存储键
   */
  private static isCurrentVersionedKey(key: string): boolean {
    return key.startsWith(`${this.STORAGE_PREFIX}${this.CURRENT_VERSION}`);
  }

  /**
   * 创建存储键匹配的正则表达式
   * @description 生成用于匹配指定 storeId 在所有版本下的存储键（常用于数据迁移、批量清理）
   * @param storeId - 存储标识符
   * @returns 正则表达式，匹配格式为 `^{prefix}[任意版本]-{指定storeId}$`
   */
  static createKeyPattern(storeId: string): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}[^-]+-${storeId}$`);
  }

  /**
   * 查找非当前版本化的存储键
   * @param key 存储键
   * @description 用于查找其他版本化的存储键
   * @returns 其他版本化的存储键，只返回查找到的第一个
   */
  private static findExistingKey(storeId: string): string | null {
    const storageKeys = Object.keys(localStorage);
    const keyPattern = this.createKeyPattern(storeId);
    return (
      storageKeys.find(key => keyPattern.test(key) && !this.isCurrentVersionedKey(key) && this.isVersionedKey(key)) ??
      null
    );
  }

  /**
   * 从存储键中提取存储ID
   * @param key 存储键
   * @description 从存储键中提取存储ID
   * @returns 存储ID
   */
  private static extractStoreIdFromKey(key: string): string | null {
    const match = key.match(new RegExp(`^${this.STORAGE_PREFIX}[^-]+-(.+)$`));
    if (!match) return null;
    return typeof match[1] === 'string' ? match[1] : null;
  }

  /**
   * 将数据从旧版本迁移到当前版本
   * @param oldKey 旧版本存储键
   * @param currentVersionKey 当前版本存储键
   * @description 将数据从旧版本迁移到当前版本
   * @returns 是否迁移成功
   */
  private static migrateData(oldKey: string, currentVersionKey: string): void {
    const oldData = localStorage.getItem(oldKey);
    if (!oldData) return;
    localStorage.setItem(currentVersionKey, oldData);
    localStorage.removeItem(oldKey);
  }

  /**
   *  批量迁移所有旧版本数据到当前版本
   * @description 一次性扫描并迁移 localStorage 中所有旧版本存储数据（通常在应用启动时调用）
   * @remarks
   * - 时间复杂度 O(n)，建议在应用启动早期调用
   * - 多次调用安全（幂等性），单个键失败不影响其他键
   * - 无效或损坏的键会被自动删除
   */
  static migrateAllData(): void {
    const storageKeys = Object.keys(localStorage);
    const oldVersionKeys = storageKeys.filter(key => this.findExistingKey(key) !== null);

    oldVersionKeys.forEach(oldKey => {
      const storeId = this.extractStoreIdFromKey(oldKey);
      if (!storeId) return;
      const currentVersionKey = this.getStorageKey(storeId);
      this.migrateData(oldKey, currentVersionKey);
    });
  }

  /**
   * 存储键统一前缀
   * @description 命名空间标识，避免与其他应用或第三方库冲突（修改会导致历史数据无法访问）
   */
  private static readonly STORAGE_PREFIX = `fast-art-cms-v`;

  /**
   * 生成版本化的存储键
   * @param key 存储键
   * @description 将存储键与版本号拼接，形成版本化的存储键
   * @returns 版本化的存储键
   */
  static getStorageKey(storeId: string, version: string = this.CURRENT_VERSION): string {
    if (this.isVersionedKey(storeId)) {
      return storeId;
    }
    return `${this.STORAGE_PREFIX}${version}-${storeId}`;
  }

  /**
   * 一些key值
   */
  static readonly USER_KEY = this.getStorageKey('user');

  static initialize(): void {
    this.migrateAllData();
  }
}
