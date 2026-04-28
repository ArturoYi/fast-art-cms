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
import { ApiContentType, FetchClientError, type RequestConfig } from '@/api/feachHook/types';
import RequestUrl from './url';
import { useUserStore } from '@/store/modules/user';
import type { CaptchaResponseDTO, LoginDTO } from './DTO/loginDTO';
import type { RegisterDTO, RegisterParams } from './DTO/registerDTO';
import type { UserUpdateDTO, UserUpdateParams } from './DTO/userDTO';
import type { BaseDTO } from './DTO/baseDTO';
import type {
  BlogCategoryDeleteDTO,
  BlogCategoryDetailDTO,
  BlogCategoryListDTO,
  BlogCategoryMutationDTO,
  BlogPostDeleteDTO,
  BlogPostDetailDTO,
  BlogPostListDTO,
  BlogPostListQuery,
  BlogPostMutationDTO,
  BlogTagDeleteDTO,
  BlogTagDetailDTO,
  BlogTagListDTO,
  BlogTagMutationDTO,
  CreateBlogCategoryBody,
  CreateBlogPostBody,
  CreateBlogTagBody,
  UpdateBlogCategoryBody,
  UpdateBlogPostBody,
  UpdateBlogTagBody
} from './DTO/blogDTO';
export { BlogPostStatus } from './DTO/blogDTO';
export type {
  BlogCategory,
  BlogPost,
  BlogPostListQuery,
  BlogPostListResult,
  BlogTag,
  CreateBlogPostBody,
  UpdateBlogPostBody
} from './DTO/blogDTO';
import { router } from '@/router';
import { RoutesAlias } from '@/router/router';
import { AUTH_ERROR_CODES, FORBIDDEN_ERROR_CODES, BusinessErrorCode } from './errorCodes';
import { showErrorMessage } from '@/utils/message';
import { normalizeAcceptLanguage, normalizeBearerToken } from './headerSanitizer';

/**
 * 处理错误响应
 * @param httpStatus HTTP 状态码
 * @param businessCode 业务错误码
 * @param message 错误消息
 */
async function handleErrorResponse(httpStatus: number, businessCode: number, message: string): Promise<never> {
  const userStore = useUserStore();

  // 1. 处理认证错误 (HTTP 401 或业务错误码 1100, 1101)
  if (httpStatus === 401 || AUTH_ERROR_CODES.includes(businessCode)) {
    const errorMessage = message || '登录已失效，请重新登录';

    // 显示错误提示
    showErrorMessage(errorMessage);

    // 检查当前是否已在登录页
    const currentPath = router.currentRoute.value.path;
    const isOnLoginPage = currentPath === RoutesAlias.Login;

    // 如果已登录，执行退出登录
    if (userStore.isLogin) {
      userStore.logout();
    } else if (!isOnLoginPage) {
      // 未登录且不在登录页，跳转到登录页
      router.replace({ path: RoutesAlias.Login });
    }
    // 如果已在登录页，不进行跳转

    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  // 2. 处理权限错误 (HTTP 403 或业务错误码 1102)
  if (httpStatus === 403 || FORBIDDEN_ERROR_CODES.includes(businessCode)) {
    const errorMessage = message || '权限不足，无法访问';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  // 3. 处理资源不存在 (HTTP 404 或业务错误码 1103)
  if (httpStatus === 404 || businessCode === BusinessErrorCode.RESOURCE_NOT_FOUND) {
    const errorMessage = message || '请求的资源不存在';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  // 4. 处理资源冲突 (HTTP 409 或业务错误码 1105)
  if (httpStatus === 409 || businessCode === BusinessErrorCode.RESOURCE_CONFLICT) {
    const errorMessage = message || '资源冲突，请检查后重试';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  // 5. 处理服务器错误 (HTTP 500 或业务错误码 0, 500)
  if (
    httpStatus >= 500 ||
    businessCode === BusinessErrorCode.SYSTEM_ERROR ||
    businessCode === BusinessErrorCode.SERVER_ERROR
  ) {
    const errorMessage = message || '服务器错误，请稍后再试';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  // 6. 处理客户端错误 (HTTP 400 或其他业务错误码)
  if (httpStatus >= 400 && httpStatus < 500) {
    const errorMessage = message || '请求错误，请检查后重试';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  // 7. 其他业务错误码 (code > 200)
  if (businessCode > 200) {
    const errorMessage = message || '请求失败';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  // 8. 未知错误（未显示提示，业务层可以自行处理）
  throw new FetchClientError('OTHER_ERROR', message || '未知错误');
}

/**
 * 处理 HTTP 错误（无法解析响应体时）
 * @param httpStatus HTTP 状态码
 */
async function handleHttpError(httpStatus: number): Promise<never> {
  const userStore = useUserStore();

  if (httpStatus === 401) {
    // 认证错误
    const errorMessage = '登录已失效，请重新登录';
    showErrorMessage(errorMessage);

    // 检查当前是否已在登录页
    const currentPath = router.currentRoute.value.path;
    const isOnLoginPage = currentPath === RoutesAlias.Login;

    if (userStore.isLogin) {
      userStore.logout();
    } else if (!isOnLoginPage) {
      router.replace({ path: RoutesAlias.Login });
    }

    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus === 403) {
    const errorMessage = '权限不足，无法访问';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus === 404) {
    const errorMessage = '请求的资源不存在';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus === 409) {
    const errorMessage = '资源冲突，请检查后重试';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus >= 500) {
    const errorMessage = '服务器错误，请稍后再试';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  if (httpStatus >= 400) {
    const errorMessage = '请求错误，请检查后重试';
    showErrorMessage(errorMessage);
    // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
    throw new FetchClientError('HANDLED_ERROR', errorMessage);
  }

  const errorMessage = '网络错误';
  showErrorMessage(errorMessage);
  // 使用 HANDLED_ERROR 类型，避免业务层再次显示提示
  throw new FetchClientError('HANDLED_ERROR', errorMessage);
}

/**
 * 实例化请求类并配置拦截器
 */
const request = new FetchRequest(
  {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      'Content-Type': ApiContentType.APPLICATION_JSON
    }
  },
  {
    // 改为数组形式，可支持多个拦截器
    requestInterceptors: [
      // 添加语言请求头
      (config: RequestConfig): RequestConfig => {
        const userStore = useUserStore();
        const currentLocale = normalizeAcceptLanguage(userStore.getCurrentLocale);
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
          let accessToken = userStore.getAccessToken;
          if (userStore.isLogin) {
            try {
              accessToken = normalizeBearerToken(accessToken);
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`
              };
            } catch (e) {
              // token 异常时直接清理登录态，避免后续请求持续报错
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
        // 克隆响应，因为 Response 只能读取一次
        const clonedResponse = response.clone();

        try {
          // 解析响应体为 BaseDTO
          const responseData: BaseDTO = await clonedResponse.json();

          // 处理 HTTP 状态码和业务错误码
          const httpStatus = response.status;
          const businessCode = responseData.code;

          // 如果 HTTP 状态码不是 200，或者业务错误码 > 200，需要处理错误
          if (!response.ok || businessCode > 200) {
            await handleErrorResponse(httpStatus, businessCode, responseData.message);
          }
        } catch (error) {
          // 如果捕获的是 FetchClientError，说明已经处理过了，直接重新抛出
          if (error instanceof FetchClientError) {
            throw error;
          }

          // 如果解析失败，可能是响应格式不正确
          // 根据 HTTP 状态码处理
          if (!response.ok) {
            await handleHttpError(response.status);
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

/** 获取登录验证码（SVG） */
export const getCaptchaService = () => {
  return request.request<CaptchaResponseDTO>({
    url: RequestUrl.captcha,
    method: 'GET'
  });
};

/**
 * 注册服务
 */
export const registerService = (data: RegisterParams) => {
  return request.request<RegisterDTO>({
    url: RequestUrl.register,
    method: 'POST',
    data
  });
};

/**
 * 当前登录用户更新个人资料
 */
export const updateUserProfileService = (data: UserUpdateParams) => {
  return request.request<UserUpdateDTO>({
    url: RequestUrl.userUpdate,
    method: 'POST',
    data
  });
};

/** 博客分类列表 */
export const getBlogCategoryListService = () => {
  return request.request<BlogCategoryListDTO>({
    url: RequestUrl.blogCategoryList,
    method: 'GET'
  });
};

/** 博客分类详情 */
export const getBlogCategoryDetailService = (id: number) => {
  return request.request<BlogCategoryDetailDTO>({
    url: RequestUrl.blogCategoryDetail(id),
    method: 'GET'
  });
};

/** 创建分类 */
export const createBlogCategoryService = (data: CreateBlogCategoryBody) => {
  return request.request<BlogCategoryMutationDTO>({
    url: RequestUrl.blogCategoryCreate,
    method: 'POST',
    data
  });
};

/** 更新分类 */
export const updateBlogCategoryService = (data: UpdateBlogCategoryBody) => {
  return request.request<BlogCategoryMutationDTO>({
    url: RequestUrl.blogCategoryUpdate,
    method: 'POST',
    data
  });
};

/** 删除分类 */
export const deleteBlogCategoryService = (id: number) => {
  return request.request<BlogCategoryDeleteDTO>({
    url: RequestUrl.blogCategoryDelete(id),
    method: 'POST'
  });
};

/** 博客标签列表 */
export const getBlogTagListService = () => {
  return request.request<BlogTagListDTO>({
    url: RequestUrl.blogTagList,
    method: 'GET'
  });
};

/** 博客标签详情 */
export const getBlogTagDetailService = (id: number) => {
  return request.request<BlogTagDetailDTO>({
    url: RequestUrl.blogTagDetail(id),
    method: 'GET'
  });
};

/** 创建标签 */
export const createBlogTagService = (data: CreateBlogTagBody) => {
  return request.request<BlogTagMutationDTO>({
    url: RequestUrl.blogTagCreate,
    method: 'POST',
    data
  });
};

/** 更新标签 */
export const updateBlogTagService = (data: UpdateBlogTagBody) => {
  return request.request<BlogTagMutationDTO>({
    url: RequestUrl.blogTagUpdate,
    method: 'POST',
    data
  });
};

/** 删除标签 */
export const deleteBlogTagService = (id: number) => {
  return request.request<BlogTagDeleteDTO>({
    url: RequestUrl.blogTagDelete(id),
    method: 'POST'
  });
};

/** 文章列表（支持 query 筛选分页） */
export const getBlogPostListService = (params?: BlogPostListQuery) => {
  return request.request<BlogPostListDTO>({
    url: RequestUrl.blogPostList,
    method: 'GET',
    params
  });
};

/** 文章详情 */
export const getBlogPostDetailService = (id: number) => {
  return request.request<BlogPostDetailDTO>({
    url: RequestUrl.blogPostDetail(id),
    method: 'GET'
  });
};

/** 创建文章 */
export const createBlogPostService = (data: CreateBlogPostBody) => {
  return request.request<BlogPostMutationDTO>({
    url: RequestUrl.blogPostCreate,
    method: 'POST',
    data
  });
};

/** 更新文章 */
export const updateBlogPostService = (data: UpdateBlogPostBody) => {
  return request.request<BlogPostMutationDTO>({
    url: RequestUrl.blogPostUpdate,
    method: 'POST',
    data
  });
};

/** 删除文章 */
export const deleteBlogPostService = (id: number) => {
  return request.request<BlogPostDeleteDTO>({
    url: RequestUrl.blogPostDelete(id),
    method: 'POST'
  });
};
