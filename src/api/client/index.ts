/**
 * @file src/api/client/index.ts
 * @description 业务层请求实例与服务定义
 *
 * 职责：
 * 1. 实例化 FetchRequest，注入全局配置（baseURL, headers）
 * 2. 注入拦截器逻辑（Token 注入、错误处理等）
 * 3. 导出具体的业务 API 服务函数 (loginService 等)
 */

import { STORAGE_KEY_USER_INFO, StorageKeyManager } from "@/utils";
import FetchRequest from "../utils";
import {
  ContentType,
  FetchClientError,
  type RequestConfig,
} from "../utils/types";
import RequestUrl from "./url";

/**
 * 实例化请求类并配置拦截器
 */
const request = new FetchRequest(
  {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": ContentType.APPLICATION_JSON,
    },
  },
  {
    // 改为数组形式，可支持多个拦截器
    requestInterceptors: [
      (config: RequestConfig): RequestConfig => {
        /**
         * 判断请求路径是否需要token
         */
        // 注意：这里简单判断 includes，实际可能需要更严格的 URL 匹配
        const tokenlessRequest = RequestUrl.tokenlessRequestUrls.some((url) =>
          config.url?.includes(url)
        );
        if (!tokenlessRequest) {
          // 需要token,设置token
          const key = StorageKeyManager.getStorageKey(STORAGE_KEY_USER_INFO);
          const userStore = localStorage.getItem(key);
          if (userStore) {
            try {
              const { accessToken } = JSON.parse(userStore);
              if (accessToken) {
                config.headers = {
                  ...config.headers,
                  Authorization: `Bearer ${accessToken}`,
                };
              }
            } catch (e) {
              throw new FetchClientError(
                "OTHER_ERROR",
                "Token parse error" + e
              );
            }
          } else {
            throw new FetchClientError("OTHER_ERROR", "User info not found");
          }
        }
        return config;
      },
    ],
  }
);

/**
 * 登录请求
 */
export const loginService = (data: any) => {
  return request.request({
    url: RequestUrl.login,
    method: "POST",
    body: data,
  });
};
