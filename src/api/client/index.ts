/**
 * @file src/api/client/index.ts
 * @description 业务层请求实例与服务定义
 *
 * 职责：
 * 1. 实例化 FetchRequest，注入全局配置（baseURL, headers）
 * 2. 注入拦截器逻辑（Token 注入、错误处理等）
 * 3. 导出具体的业务 API 服务函数 (loginService 等)
 */

import FetchRequest from '@/api/index';
import { ContentType, FetchClientError, type RequestConfig } from '@/api/feachHook/types';
import RequestUrl from './url';
import { useUserStore } from '@/store/modules/user';
import type { LoginDTO } from './DTO/loginDTO';
import type { BaseDTO } from './DTO/baseDTO';

/**
 * 实例化请求类并配置拦截器
 */
const request = new FetchRequest(
  {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      'Content-Type': ContentType.APPLICATION_JSON
    }
  },
  {
    // 改为数组形式，可支持多个拦截器
    requestInterceptors: [
      // 添加语言请求头
      (config: RequestConfig): RequestConfig => {
        const userStore = useUserStore();
        const currentLocale = userStore.getCurrentLocale;
        config.headers = {
          ...config.headers,
          'Accept-Language': currentLocale
        };
        return config;
      },
      // Token 拦截器
      (config: RequestConfig): RequestConfig => {
        /**
         * 判断请求路径是否需要token
         */
        // 注意：这里简单判断 includes，实际可能需要更严格的 URL 匹配
        const tokenlessRequest = RequestUrl.tokenlessRequestUrls.some(url => config.url?.includes(url));
        if (!tokenlessRequest) {
          // 需要token,设置token
          const userStore = useUserStore();
          const accessToken = userStore.getAccessToken;
          if (userStore.isLogin) {
            try {
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`
              };
            } catch (e) {
              throw new FetchClientError('OTHER_ERROR', 'Token parse error' + e);
            }
          } else {
            throw new FetchClientError('OTHER_ERROR', 'User info not found');
          }
        }
        return config;
      }
    ],
    responseInterceptors: [
      async (response: Response): Promise<Response> => {
        if (!response.ok) {
          throw new FetchClientError('OTHER_ERROR', 'Response is not ok');
        } else {
          // 克隆响应，因为 Response 只能读取一次
          const clonedResponse = response.clone();
          try {
            // 解析响应体为 BaseDTO
            const responseData: BaseDTO = await clonedResponse.json();

            // 验证 code，如果 code > 200，抛出异常
            if (responseData.code > 200) {
              throw new FetchClientError('SERVER_ERROR', responseData.message || '请求失败');
            }
          } catch (error) {
            // 如果解析失败或验证失败，抛出异常
            if (error instanceof FetchClientError) {
              throw error;
            }
            // 如果 JSON 解析失败，可能是响应格式不正确，但不影响正常流程
            // 让后续的 json() 调用处理
          }
        }

        return response;
      }
    ]
  }
);

/**
 * 登录请求
 */
export const loginService = (data: any) => {
  return request.request<LoginDTO>({
    url: RequestUrl.login,
    method: 'POST',
    body: data
  });
};
