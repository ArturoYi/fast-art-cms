/**
 * @file src/utils/message.ts
 * @description 全局消息提示工具
 *
 * 用于在非组件环境中显示消息提示（如拦截器中）
 * 直接使用 NaiveUI 的 useMessage API
 */

import type { MessageApi } from 'naive-ui';

/**
 * 全局消息实例
 */
let globalMessage: MessageApi | null = null;

/**
 * 设置全局消息实例
 * @param message NaiveUI 的 MessageApi 实例
 */
export function setGlobalMessage(message: MessageApi): void {
  globalMessage = message;
}

/**
 * 获取全局消息实例
 * @returns MessageApi 实例
 */
export function getGlobalMessage(): MessageApi | null {
  return globalMessage;
}

/**
 * 显示成功消息
 */
export function showSuccessMessage(content: string, duration?: number): void {
  globalMessage?.success(content, { duration });
}

/**
 * 显示错误消息
 */
export function showErrorMessage(content: string, duration?: number): void {
  globalMessage?.error(content, { duration });
}

/**
 * 显示警告消息
 */
export function showWarningMessage(content: string, duration?: number): void {
  globalMessage?.warning(content, { duration });
}

/**
 * 显示信息消息
 */
export function showInfoMessage(content: string, duration?: number): void {
  globalMessage?.info(content, { duration });
}
