import type { BaseDTO } from './baseDTO';

export interface SecurityMeta {
  serverTime: number;
  sign: { version: string; algorithm: string };
  encrypt: { requiredForLevel: string; algorithm: string; kid: string };
  policyVersion: string;
  transport: { httpsRequired: boolean };
}

export type SecurityMetaDTO = BaseDTO<SecurityMeta>;
