import type { BaseDTO } from './baseDTO';
import type { L2Credentials } from '../crypto/l2';

export type { L2Credentials } from '../crypto/l2';

export type VaultL2ResOp<T> = { code: number; message: string; data: T | null };

export interface CreateVaultBody {
  title: string;
  username?: string;
  password?: string;
  url?: string;
  icon?: string;
  category?: string;
  tags?: string;
  metadata?: string;
  version?: number;
}

export interface UpdateVaultBody {
  id: number;
  title?: string;
  username?: string;
  password?: string;
  url?: string;
  icon?: string;
  category?: string;
  tags?: string;
  metadata?: string;
  version?: number;
}

export interface DeleteVaultBody {
  ids: number[];
}

export type VaultL2ListDTO = BaseDTO<unknown[]>;
export type VaultL2MutationDTO = BaseDTO<unknown>;
export type VaultL2DeleteDTO = BaseDTO<unknown>;
export type VaultL2DetailDTO = BaseDTO<unknown>;
export type VaultL2ExportDTO = BaseDTO<unknown>;
export type VaultL2ClearDTO = BaseDTO<unknown>;

/** L2 请求选项：与 security/meta 中的 kid 一致，并需在 encryptKeys 中配置对应 32 字节 key */
export interface VaultL2RequestOptions {
  cred: L2Credentials;
  kid: string;
}
