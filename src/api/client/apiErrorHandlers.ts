import { useUserStore } from '@/store/modules/user';
import { router } from '@/router';
import { RoutesAlias } from '@/router/router';
import { AUTH_ERROR_CODES, FORBIDDEN_ERROR_CODES, BusinessErrorCode } from './errorCodes';
import { showErrorMessage } from '@/utils/message';
import { FetchClientError } from '@/api/feachHook/types';

/**
 * 处理统一 ResOp 错误
 */
export async function handleErrorResponse(httpStatus: number, businessCode: number, message: string): Promise<never> {
  const userStore = useUserStore();

  if (httpStatus === 401 || AUTH_ERROR_CODES.includes(businessCode)) {
    const errorMessage = message || '登录已失效，请重新登录';
    showErrorMessage(errorMessage);
    const currentPath = router.currentRoute.value.path;
    const isOnLoginPage = currentPath === RoutesAlias.Login;
    if (userStore.isLogin) {
      userStore.logout();
    } else if (!isOnLoginPage) {
      router.replace({ path: RoutesAlias.Login });
    }
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus === 403 || FORBIDDEN_ERROR_CODES.includes(businessCode)) {
    const errorMessage = message || '权限不足，无法访问';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus === 404 || businessCode === BusinessErrorCode.RESOURCE_NOT_FOUND) {
    const errorMessage = message || '请求的资源不存在';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus === 409 || businessCode === BusinessErrorCode.RESOURCE_CONFLICT) {
    const errorMessage = message || '资源冲突，请检查后重试';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (
    httpStatus >= 500 ||
    businessCode === BusinessErrorCode.SYSTEM_ERROR ||
    businessCode === BusinessErrorCode.SERVER_ERROR
  ) {
    const errorMessage = message || '服务器错误，请稍后再试';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus >= 400 && httpStatus < 500) {
    const errorMessage = message || '请求错误，请检查后重试';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (businessCode > 200) {
    const errorMessage = message || '请求失败';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  throw new FetchClientError('OTHER_ERROR', message || '未知错误');
}

/**
 * 无法解析 JSON 时的 HTTP 状态处理
 */
export async function handleHttpError(httpStatus: number): Promise<never> {
  const userStore = useUserStore();

  if (httpStatus === 401) {
    const errorMessage = '登录已失效，请重新登录';
    showErrorMessage(errorMessage);
    const currentPath = router.currentRoute.value.path;
    const isOnLoginPage = currentPath === RoutesAlias.Login;
    if (userStore.isLogin) {
      userStore.logout();
    } else if (!isOnLoginPage) {
      router.replace({ path: RoutesAlias.Login });
    }
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus === 403) {
    const errorMessage = '权限不足，无法访问';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus === 404) {
    const errorMessage = '请求的资源不存在';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus === 409) {
    const errorMessage = '资源冲突，请检查后重试';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus >= 500) {
    const errorMessage = '服务器错误，请稍后再试';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus >= 400) {
    const errorMessage = '请求错误，请检查后重试';
    showErrorMessage(errorMessage);
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  const errorMessage = '网络错误';
  showErrorMessage(errorMessage);
  throw new FetchClientError('HANDLED_ERROR', errorMessage);
}
