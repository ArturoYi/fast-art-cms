import type { BaseDTO } from './baseDTO';

export interface SsePushParams {
  data: string;
  event?: string;
  clientId?: string;
}

export type SsePushResult = unknown;

export type SseClientsData = BaseDTO<unknown>;
