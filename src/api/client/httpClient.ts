/**
 * 全局 fetch 业务实例，供本目录内 api 与 vault 等 L2 调用复用
 */
import FetchRequest from '@/api/index';
import { ApiContentType, FetchClientError, type RequestConfig } from '@/api/feachHook/types';
import RequestUrl from './url';
import { useUserStore } from '@/store/modules/user';
import { normalizeAcceptLanguage, normalizeBearerToken } from './headerSanitizer';
import { handleErrorResponse, handleHttpError } from './apiErrorHandlers';
import type { BaseDTO } from './DTO/baseDTO';

function isL2CipherEnvelope(
  o: object
): o is { alg: 'A256GCM'; kid: string; iv: string; aad: string; ciphertext: string; tag: string } {
  return 'alg' in o && (o as { alg?: string }).alg === 'A256GCM' && 'ciphertext' in o && 'tag' in o;
}

export const apiRequest = new FetchRequest(
  {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      'Content-Type': ApiContentType.APPLICATION_JSON
    }
  },
  {
    requestInterceptors: [
      (config: RequestConfig): RequestConfig => {
        const userStore = useUserStore();
        const currentLocale = normalizeAcceptLanguage(userStore.getCurrentLocale);
        config.headers = {
          ...config.headers,
          'Accept-Language': currentLocale
        };
        return config;
      },
      (config: RequestConfig): RequestConfig => {
        const tokenlessRequest = RequestUrl.tokenlessRequestUrls.some(u => config.url?.includes(u));
        if (!tokenlessRequest) {
          const userStore = useUserStore();
          const accessToken = userStore.getAccessToken;
          if (userStore.isLogin) {
            try {
              const token = normalizeBearerToken(accessToken);
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
              };
            } catch (e) {
              userStore.logout();
              throw new FetchClientError(
                'OTHER_ERROR',
                'Token parse error' + (e instanceof Error && e.message ? `: ${e.message}` : '')
              );
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
        const clonedResponse = response.clone();
        try {
          const responseData = (await clonedResponse.json()) as BaseDTO & Record<string, unknown>;
          if (
            responseData &&
            typeof responseData === 'object' &&
            isL2CipherEnvelope(responseData) &&
            (responseData as { code?: unknown }).code === undefined
          ) {
            return response;
          }
          const httpStatus = response.status;
          const businessCode = responseData.code;
          if (!response.ok || (typeof businessCode === 'number' && businessCode > 200)) {
            await handleErrorResponse(
              httpStatus,
              (typeof businessCode === 'number' ? businessCode : 0) || 0,
              typeof responseData.message === 'string' ? responseData.message : ''
            );
          }
        } catch (error) {
          if (error instanceof FetchClientError) {
            throw error;
          }
          if (!response.ok) {
            await handleHttpError(response.status);
          }
        }
        return response;
      }
    ]
  }
);
