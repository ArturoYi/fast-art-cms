/**
 * @file src/api/client/errorCodes.ts
 * @description 业务错误码定义
 *
 * 根据后端异常处理文档，定义业务错误码及其对应的处理方式
 */

/**
 * 业务错误码枚举
 */
export enum BusinessErrorCode {
  /** 系统错误 */
  SYSTEM_ERROR = 0,
  SERVER_ERROR = 500,

  /** 客户端请求错误 (HTTP 400) */
  BUSINESS_LOGIC_ERROR = 1001,
  INVALID_CREDENTIALS = 1003,
  INVALID_PARAMS = 1104,

  /** 认证失败 (HTTP 401) */
  AUTHENTICATION_FAILED = 1100,
  INVALID_LOGIN = 1101,

  /** 权限不足 (HTTP 403) */
  FORBIDDEN = 1102,

  /** 资源不存在 (HTTP 404) */
  RESOURCE_NOT_FOUND = 1103,

  /** 资源冲突 (HTTP 409) */
  RESOURCE_CONFLICT = 1105
}

/**
 * 错误码到 HTTP 状态码的映射
 * 与后端保持一致
 */
export const ErrorCodeToHttpStatusMap: Record<number, number> = {
  [BusinessErrorCode.SYSTEM_ERROR]: 500,
  [BusinessErrorCode.SERVER_ERROR]: 500,
  [BusinessErrorCode.BUSINESS_LOGIC_ERROR]: 400,
  [BusinessErrorCode.INVALID_CREDENTIALS]: 400,
  [BusinessErrorCode.INVALID_PARAMS]: 400,
  [BusinessErrorCode.AUTHENTICATION_FAILED]: 401,
  [BusinessErrorCode.INVALID_LOGIN]: 401,
  [BusinessErrorCode.FORBIDDEN]: 403,
  [BusinessErrorCode.RESOURCE_NOT_FOUND]: 404,
  [BusinessErrorCode.RESOURCE_CONFLICT]: 409
};

/**
 * 需要跳转登录页的错误码
 */
export const AUTH_ERROR_CODES = [BusinessErrorCode.AUTHENTICATION_FAILED, BusinessErrorCode.INVALID_LOGIN];

/**
 * 权限错误码
 */
export const FORBIDDEN_ERROR_CODES = [BusinessErrorCode.FORBIDDEN];
