import { FetchClientError } from '@/api/feachHook/types';
import { apiRequest } from './httpClient';
import {
  buildL2Signature,
  decryptPayloadToString,
  encryptPlainObjectToPayload,
  isCipherPayload,
  type CipherPayload,
  type L2Credentials
} from './crypto/l2';
import type { VaultL2ResOp } from './DTO/vaultDTO';

function resolvePathWithQuery(path: string): string {
  const base =
    import.meta.env.VITE_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  const u = new URL(path, base);
  return u.pathname + u.search;
}

/**
 * 调用 Vault 等 L2 接口；返回解密后的 `data` 字段（内层为 ResOp）
 */
export async function executeVaultL2Request<T>(
  cred: L2Credentials,
  kid: string,
  opts: { method: 'GET' | 'POST'; path: string; body?: unknown }
): Promise<T> {
  const keyB64 = cred.encryptKeys[kid];
  if (!keyB64) {
    throw new FetchClientError('OTHER_ERROR', `No encrypt key for kid: ${kid}`);
  }
  const pathWithQuery = resolvePathWithQuery(opts.path);
  const timestamp = String(Date.now());
  const nonce = crypto.randomUUID();
  const aad = { method: opts.method, path: pathWithQuery, timestamp, nonce } as const;

  let bodyJson = '';
  let dataBody: CipherPayload | undefined;
  if (opts.method === 'POST') {
    dataBody = await encryptPlainObjectToPayload(opts.body ?? {}, aad, kid, keyB64);
    bodyJson = JSON.stringify(dataBody);
  }

  const sign = await buildL2Signature(cred.signSecret, {
    method: opts.method,
    pathWithQuery,
    timestamp,
    nonce,
    bodyJson
  });

  const raw = await apiRequest.request<CipherPayload | VaultL2ResOp<T> | { code: number; message: string }>({
    url: opts.path,
    method: opts.method,
    data: dataBody,
    headers: {
      'X-Timestamp': timestamp,
      'X-Nonce': nonce,
      'X-Sign-Version': 'v1',
      'X-Signature': sign,
      'X-Encrypt': '1',
      'X-Key-Id': kid
    }
  });

  if (raw && typeof raw === 'object' && isCipherPayload(raw)) {
    const resKid = raw.kid;
    const k = cred.encryptKeys[resKid] || keyB64;
    const plain = await decryptPayloadToString(raw, k);
    const inner = JSON.parse(plain) as VaultL2ResOp<T>;
    if (inner.code !== 200) {
      throw new FetchClientError('OTHER_ERROR', inner.message || 'Vault L2 business error');
    }
    return inner.data as T;
  }

  throw new FetchClientError('OTHER_ERROR', 'Unexpected L2 response shape');
}
