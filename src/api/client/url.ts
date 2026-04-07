/**
 * @file src/api/client/url.ts
 * @description 接口 URL 集中管理
 *
 * 职责：
 * 1. 集中定义所有 API 接口地址常量
 * 2. 维护无需 Token 校验的白名单
 */

class RequestUrl {
  /**
   * 登录接口
   * @returns {string} 登录接口
   */
  static readonly login: string = '/api/auth/login';

  /** 登录验证码 */
  static readonly captcha: string = '/api/auth/captcha';

  /**
   * 获取服务器信息接口
   * @returns {string} 获取服务器信息接口
   */
  static readonly getServerInfo: string = '/api/system/serve/start';

  /** 博客：分类 */
  static readonly blogCategoryList: string = '/api/blog/category/list';
  static readonly blogCategoryCreate: string = '/api/blog/category/create';
  static readonly blogCategoryUpdate: string = '/api/blog/category/update';
  static blogCategoryDetail(id: number): string {
    return `/api/blog/category/detail/${id}`;
  }
  static blogCategoryDelete(id: number): string {
    return `/api/blog/category/delete/${id}`;
  }

  /** 博客：标签 */
  static readonly blogTagList: string = '/api/blog/tag/list';
  static readonly blogTagCreate: string = '/api/blog/tag/create';
  static readonly blogTagUpdate: string = '/api/blog/tag/update';
  static blogTagDetail(id: number): string {
    return `/api/blog/tag/detail/${id}`;
  }
  static blogTagDelete(id: number): string {
    return `/api/blog/tag/delete/${id}`;
  }

  /** 博客：文章 */
  static readonly blogPostList: string = '/api/blog/post/list';
  static readonly blogPostCreate: string = '/api/blog/post/create';
  static readonly blogPostUpdate: string = '/api/blog/post/update';
  static blogPostDetail(id: number): string {
    return `/api/blog/post/detail/${id}`;
  }
  static blogPostDelete(id: number): string {
    return `/api/blog/post/delete/${id}`;
  }

  /**
   * 无需 token 的接口
   */
  static readonly tokenlessRequestUrls: string[] = [RequestUrl.login, RequestUrl.captcha];
}

export default RequestUrl;
