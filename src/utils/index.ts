import { StorageConfig } from '@/utils/storage';

/**
 * 工具函数
 * @description 工具函数
 * @exports StorageConfig 存储配置
 */
export { StorageConfig };

/**
 * 根据函数的初始化，如果太多函数，可以考虑使用一个初始化函数
 * @description 根据函数的初始化，如果太多函数，可以考虑使用一个初始化函数
 * @exports initialize 初始化函数
 */
export function utilsInitialize(): void {
  StorageConfig.initialize();
}
