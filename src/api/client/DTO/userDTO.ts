import type { BaseDTO } from './baseDTO';

/**
 * 当前登录用户修改个人资料请求参数
 * 所有字段均为可选，仅传入需要更新的字段
 */
export interface UserUpdateParams {
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  qq?: string;
  remark?: string;
}

/**
 * 用户资料更新接口响应类型
 * 成功返回 201，data 为空
 */
export type UserUpdateDTO = BaseDTO<null>;

export interface UserPasswordParams {
  oldPassword: string;
  newPassword: string;
}

export type UserPasswordDTO = BaseDTO<null>;

export type UserPermissionsDTO = BaseDTO<string[]>;

/** `GET /users/:id` 等返回的用户详情，以后端实际字段为准 */
export interface UserProfile {
  id: number;
  username?: string;
  nickname?: string;
  avatar?: string | null;
  email?: string | null;
  phone?: string | null;
  qq?: string | null;
  remark?: string | null;
  [key: string]: unknown;
}

export type UserDetailDTO = BaseDTO<UserProfile | null>;
