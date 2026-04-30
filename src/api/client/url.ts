/**
 * @file src/api/client/url.ts
 * @description 接口 URL 集中管理（以 CMS_APP_API_INTEGRATION.md 为准）
 *
 * 注意：除全局前缀 `api` 外，部分模块会叠加模块前缀（例如 Serve 在 `system` 下）。
 */

class RequestUrl {
  /** 4.1.1 GET /security/meta（公开） */
  static readonly securityMeta: string = '/api/security/meta';

  /** 4.2 Auth */
  static readonly login: string = '/api/auth/login';
  static readonly captcha: string = '/api/auth/captcha';
  static readonly register: string = '/api/auth/register';

  /** 4.3 Users */
  static readonly userMe: string = '/api/users/me';
  static readonly userUpdate: string = '/api/users/update';
  static readonly userPassword: string = '/api/users/password';
  static readonly userPermissions: string = '/api/users/permissions';
  static userById(id: string | number): string {
    return `/api/users/${id}`;
  }

  /** 4.6 Serve：真实地址为 /system/serve/start（最终带全局前缀 /api） */
  static readonly getServerInfo: string = '/api/system/serve/start';

  /** 4.5 SSE（Bypass） */
  static readonly sseStream: string = '/api/sse/stream';
  static readonly sseClients: string = '/api/sse/clients';
  static readonly ssePush: string = '/api/sse/push';

  /** 4.7 Vault（L2） */
  static readonly vaultList: string = '/api/vault/list';
  static readonly vaultCreate: string = '/api/vault/create';
  static readonly vaultUpdate: string = '/api/vault/update';
  static readonly vaultDelete: string = '/api/vault/delete';
  static vaultDetail(id: number): string {
    return `/api/vault/detail/${id}`;
  }
  static readonly vaultExport: string = '/api/vault/export';
  static readonly vaultClear: string = '/api/vault/clear';

  /** 4.4 Blog */
  static readonly blogCategoryList: string = '/api/blog/category/list';
  static readonly blogCategoryCreate: string = '/api/blog/category/create';
  static readonly blogCategoryUpdate: string = '/api/blog/category/update';
  static blogCategoryDetail(id: number): string {
    return `/api/blog/category/detail/${id}`;
  }
  static blogCategoryDelete(id: number): string {
    return `/api/blog/category/delete/${id}`;
  }

  static readonly blogTagList: string = '/api/blog/tag/list';
  static readonly blogTagCreate: string = '/api/blog/tag/create';
  static readonly blogTagUpdate: string = '/api/blog/tag/update';
  static blogTagDetail(id: number): string {
    return `/api/blog/tag/detail/${id}`;
  }
  static blogTagDelete(id: number): string {
    return `/api/blog/tag/delete/${id}`;
  }

  static readonly blogPostList: string = '/api/blog/post/list';
  static readonly blogPostCreate: string = '/api/blog/post/create';
  static readonly blogPostUpdate: string = '/api/blog/post/update';
  static blogPostDetail(id: number): string {
    return `/api/blog/post/detail/${id}`;
  }
  static blogPostDelete(id: number): string {
    return `/api/blog/post/delete/${id}`;
  }

  /** 无需 token 的接口 */
  static readonly tokenlessRequestUrls: string[] = [
    RequestUrl.login,
    RequestUrl.captcha,
    RequestUrl.register,
    RequestUrl.securityMeta,
    RequestUrl.sseStream
  ];
}

/** 4.5.1 SSE stream URL 组装（tick / heartbeat） */
export function buildSseStreamUrl(params?: { tick?: number; heartbeat?: number }): string {
  const base =
    import.meta.env.VITE_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  const u = new URL(RequestUrl.sseStream, base);
  if (params?.tick !== undefined) u.searchParams.set('tick', String(params.tick));
  if (params?.heartbeat !== undefined) u.searchParams.set('heartbeat', String(params.heartbeat));
  return u.href;
}

export default RequestUrl;
