/**
 * @file src/api/client/index.ts
 * @description 业务层 API（以 CMS_APP_API_INTEGRATION.md 为准）
 */
import { type RequestConfig } from '@/api/feachHook/types';
import { apiRequest } from './httpClient';
import RequestUrl from './url';
import type { CaptchaResponseDTO, LoginDTO } from './DTO/loginDTO';
import type { RegisterDTO, RegisterParams } from './DTO/registerDTO';
import type {
  UserUpdateDTO,
  UserUpdateParams,
  UserPasswordDTO,
  UserPasswordParams,
  UserDetailDTO,
  UserPermissionsDTO
} from './DTO/userDTO';
import type { SecurityMetaDTO } from './DTO/securityDTO';
import type { SsePushParams, SsePushResult } from './DTO/sseDTO';
import type { CreateVaultBody, DeleteVaultBody, UpdateVaultBody, VaultL2RequestOptions } from './DTO/vaultDTO';
import { executeVaultL2Request } from './vaultL2Request';
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
export { buildSseStreamUrl, default as RequestUrl } from './url';
export type { L2Credentials } from './crypto/l2';
export type { VaultL2RequestOptions } from './DTO/vaultDTO';
export { executeVaultL2Request } from './vaultL2Request';

const request = apiRequest;

const bypassConfig = (extra?: RequestConfig): RequestConfig => ({
  ...extra,
  skipEnvelopeParse: true
});

/* ========== 4.1 Security ========== */

export const getSecurityMetaService = () => {
  return request.request<SecurityMetaDTO>({
    url: RequestUrl.securityMeta,
    method: 'GET'
  });
};

/* ========== 4.2 Auth（公开） ========== */

export const loginService = (data: any) => {
  return request.request<LoginDTO>({
    url: RequestUrl.login,
    method: 'POST',
    body: data
  });
};

export const getCaptchaService = () => {
  return request.request<CaptchaResponseDTO>({
    url: RequestUrl.captcha,
    method: 'GET'
  });
};

export const registerService = (data: RegisterParams) => {
  return request.request<RegisterDTO>({
    url: RequestUrl.register,
    method: 'POST',
    data
  });
};

/* ========== 4.3 Users（需登录） ========== */

export const getUserPermissionsService = () => {
  return request.request<UserPermissionsDTO>({
    url: RequestUrl.userPermissions,
    method: 'GET'
  });
};

export const updateUserPasswordService = (data: UserPasswordParams) => {
  return request.request<UserPasswordDTO>({
    url: RequestUrl.userPassword,
    method: 'POST',
    data
  });
};

export const updateUserProfileService = (data: UserUpdateParams) => {
  return request.request<UserUpdateDTO>({
    url: RequestUrl.userUpdate,
    method: 'POST',
    data
  });
};

export const getUserByIdService = (id: string | number) => {
  return request.request<UserDetailDTO>({
    url: RequestUrl.userById(id),
    method: 'GET'
  });
};

/* ========== 4.4 Blog（需登录 + 权限） ========== */

export const getBlogCategoryListService = () => {
  return request.request<BlogCategoryListDTO>({
    url: RequestUrl.blogCategoryList,
    method: 'GET'
  });
};

export const getBlogCategoryDetailService = (id: number) => {
  return request.request<BlogCategoryDetailDTO>({
    url: RequestUrl.blogCategoryDetail(id),
    method: 'GET'
  });
};

export const createBlogCategoryService = (data: CreateBlogCategoryBody) => {
  return request.request<BlogCategoryMutationDTO>({
    url: RequestUrl.blogCategoryCreate,
    method: 'POST',
    data
  });
};

export const updateBlogCategoryService = (data: UpdateBlogCategoryBody) => {
  return request.request<BlogCategoryMutationDTO>({
    url: RequestUrl.blogCategoryUpdate,
    method: 'POST',
    data
  });
};

export const deleteBlogCategoryService = (id: number) => {
  return request.request<BlogCategoryDeleteDTO>({
    url: RequestUrl.blogCategoryDelete(id),
    method: 'POST'
  });
};

export const getBlogTagListService = () => {
  return request.request<BlogTagListDTO>({
    url: RequestUrl.blogTagList,
    method: 'GET'
  });
};

export const getBlogTagDetailService = (id: number) => {
  return request.request<BlogTagDetailDTO>({
    url: RequestUrl.blogTagDetail(id),
    method: 'GET'
  });
};

export const createBlogTagService = (data: CreateBlogTagBody) => {
  return request.request<BlogTagMutationDTO>({
    url: RequestUrl.blogTagCreate,
    method: 'POST',
    data
  });
};

export const updateBlogTagService = (data: UpdateBlogTagBody) => {
  return request.request<BlogTagMutationDTO>({
    url: RequestUrl.blogTagUpdate,
    method: 'POST',
    data
  });
};

export const deleteBlogTagService = (id: number) => {
  return request.request<BlogTagDeleteDTO>({
    url: RequestUrl.blogTagDelete(id),
    method: 'POST'
  });
};

export const getBlogPostListService = (params?: BlogPostListQuery) => {
  return request.request<BlogPostListDTO>({
    url: RequestUrl.blogPostList,
    method: 'GET',
    params
  });
};

export const getBlogPostDetailService = (id: number) => {
  return request.request<BlogPostDetailDTO>({
    url: RequestUrl.blogPostDetail(id),
    method: 'GET'
  });
};

export const createBlogPostService = (data: CreateBlogPostBody) => {
  return request.request<BlogPostMutationDTO>({
    url: RequestUrl.blogPostCreate,
    method: 'POST',
    data
  });
};

export const updateBlogPostService = (data: UpdateBlogPostBody) => {
  return request.request<BlogPostMutationDTO>({
    url: RequestUrl.blogPostUpdate,
    method: 'POST',
    data
  });
};

export const deleteBlogPostService = (id: number) => {
  return request.request<BlogPostDeleteDTO>({
    url: RequestUrl.blogPostDelete(id),
    method: 'POST'
  });
};

/* ========== 4.5 SSE（Bypass） ========== */

/** 连接数统计（需登录，不校验权限码；Bypass 响应） */
export const getSseClientsService = () => {
  return request.request<unknown | null>(
    bypassConfig({
      url: RequestUrl.sseClients,
      method: 'GET'
    })
  );
};

/** 推送事件（需登录，不校验权限码；Bypass 响应） */
export const pushSseEventService = (data: SsePushParams) => {
  return request.request<SsePushResult | null>(
    bypassConfig({
      url: RequestUrl.ssePush,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  );
};

/* ========== 4.6 Serve（SSE：见 useServeStatSse） ========== */

/* ========== 4.7 Vault（L2） ========== */

export const getVaultListL2Service = (o: VaultL2RequestOptions) => {
  return executeVaultL2Request<unknown[]>(o.cred, o.kid, { method: 'GET', path: RequestUrl.vaultList });
};

export const createVaultL2Service = (o: VaultL2RequestOptions, body: CreateVaultBody) => {
  return executeVaultL2Request<unknown>(o.cred, o.kid, { method: 'POST', path: RequestUrl.vaultCreate, body });
};

export const updateVaultL2Service = (o: VaultL2RequestOptions, body: UpdateVaultBody) => {
  return executeVaultL2Request<unknown>(o.cred, o.kid, { method: 'POST', path: RequestUrl.vaultUpdate, body });
};

export const deleteVaultL2Service = (o: VaultL2RequestOptions, body: DeleteVaultBody) => {
  return executeVaultL2Request<unknown>(o.cred, o.kid, { method: 'POST', path: RequestUrl.vaultDelete, body });
};

export const getVaultDetailL2Service = (o: VaultL2RequestOptions, id: number) => {
  return executeVaultL2Request<unknown>(o.cred, o.kid, { method: 'GET', path: RequestUrl.vaultDetail(id) });
};

export const exportVaultL2Service = (o: VaultL2RequestOptions) => {
  return executeVaultL2Request<unknown>(o.cred, o.kid, { method: 'GET', path: RequestUrl.vaultExport });
};

export const clearVaultL2Service = (o: VaultL2RequestOptions) => {
  return executeVaultL2Request<null>(o.cred, o.kid, { method: 'POST', path: RequestUrl.vaultClear, body: {} });
};

/** 高级：透传本目录 http 实例（如自定义头） */
export { apiRequest };
