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

  /**
   * 获取服务器信息接口
   * @returns {string} 获取服务器信息接口
   */
  static readonly getServerInfo: string = '/api/system/serve/start';

  /**
   * 无需 token 的接口
   */
  static readonly tokenlessRequestUrls: string[] = [RequestUrl.login];
}

export default RequestUrl;
