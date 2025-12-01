/**
 * 存储键常量定义
 *
 * @description
 * 统一管理应用中所有的 storeId 常量，配合 StorageKeyManager 使用。
 * 使用常量而非硬编码字符串，便于重构、避免拼写错误、支持 IDE 自动补全。
 *
 * @remarks
 * - 命名规范：`STORAGE_KEY_` 前缀 + 大写下划线命名
 * - 实际使用时通过 `StorageKeyManager.getStorageKey(STORAGE_KEY_USER_INFO)` 获取完整键名
 */

// ==================== 用户相关 ====================

/** 用户基本信息 */
export const STORAGE_KEY_USER_INFO = "user-info";
