/**
 * 存储配置管理类
 *
 * @description
 * 提供版本化的存储键名管理方案，解决以下核心问题：
 * 1. **版本隔离** - 不同版本的应用使用不同的存储键，避免数据结构变更导致的兼容性问题
 * 2. **命名空间** - 通过统一前缀防止多个应用在同一域名下的存储冲突
 * 3. **可追溯性** - 支持从存储键中提取版本号和存储ID，便于调试和数据迁移
 * 4. **灵活查询** - 提供多种正则模式用于批量匹配和清理旧版本数据
 *
 * @remarks
 * 存储键格式: `{STORAGE_PREFIX}{version}-{storeId}`，如 `sys-v1.2.3-user-settings`
 */
export class StorageConfig {
  /**
   * 当前应用版本
   * @description 从 Vite 全局常量 `__APP_VERSION__` 获取，用于生成版本化的存储键
   */
  static readonly CURRENT_VERSION = __APP_VERSION__;

  /**
   * 存储键统一前缀
   * @description 命名空间标识，避免与其他应用或第三方库冲突（修改会导致历史数据无法访问）
   */
  static readonly STORAGE_PREFIX = "sys-v";

  /**
   * 生成版本化的存储键名
   * @param storeId - 存储标识符（如 "user-info"、"app-settings"）
   * @param version - 版本号，默认使用当前应用版本
   * @returns 完整的存储键名，格式为 `{prefix}{version}-{storeId}`
   */
  static generateStorageKey(
    storeId: string,
    version: string = this.CURRENT_VERSION
  ): string {
    const key = `${this.STORAGE_PREFIX}${version}-${storeId}`;
    return key;
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
   * 创建当前版本存储键匹配的正则表达式
   * @description 生成匹配当前版本所有存储键的正则（常用于批量加载或清理旧版本数据）
   * @returns 正则表达式，匹配格式为 `^{prefix}{当前版本}-`
   */
  static createCurrentVersionPattern(): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}${this.CURRENT_VERSION}-`);
  }

  /**
   * 创建任意版本存储键匹配的正则表达式
   * @description 生成匹配所有版本存储键的正则（常用于全局清理，使用需谨慎）
   * @returns 正则表达式，匹配所有以 `{prefix}` 开头的存储键
   */
  static createVersionPattern(): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}`);
  }

  /**
   * 从存储键中提取版本号
   * @description 解析存储键字符串，提取版本号部分（用于版本比对、数据迁移）
   * @param key - 完整的存储键名
   * @returns 版本号字符串，解析失败返回 `null`
   */
  static extractVersionFromKey(key: string): string | null {
    const match = key.match(new RegExp(`^${this.STORAGE_PREFIX}([^-]+)-`));
    if (!match) return null;
    return typeof match[1] === "string" ? match[1] : null;
  }

  /**
   * 从存储键中提取存储ID
   * @description 解析存储键字符串，提取 storeId 部分（用于日志记录、调试、批量操作）
   * @param key - 完整的存储键名
   * @returns 存储ID字符串，解析失败返回 `null`
   */
  static extractStoreIdFromKey(key: string): string | null {
    const match = key.match(new RegExp(`^${this.STORAGE_PREFIX}[^-]+-(.+)$`));
    if (!match) return null;
    return typeof match[1] === "string" ? match[1] : null;
  }
}
