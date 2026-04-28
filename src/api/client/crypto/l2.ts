/**
 * 与 Nest `ApiSecurityService` 一致的 L1/L2 计算（Web Crypto）
 * 签名/加密密钥须由受信环境注入（生产不宜嵌入前端公开产物，建议 BFF/私有部署）。
 */
export type CipherPayload = {
  alg: 'A256GCM';
  kid: string;
  iv: string;
  aad: string;
  ciphertext: string;
  tag: string;
};

export type L2Credentials = {
  /** 与服务器 SECURITY_API_SIGN_SECRET 一致；用于 HMAC */
  signSecret: string;
  /** kid -> AES-256 密钥（base64，32 字节） */
  encryptKeys: Record<string, string>;
};

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i) ?? 0;
  }
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i] ?? 0);
  return btoa(s);
}

function utf8(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

export async function sha256HexOfString(bodyJson: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', utf8(bodyJson) as BufferSource);
  return bufferToHex(hash);
}

function buildCanonicalString(
  method: string,
  pathWithQuery: string,
  timestamp: string,
  nonce: string,
  bodySha256Hex: string
): string {
  return [method.toUpperCase(), pathWithQuery, timestamp, nonce, bodySha256Hex].join('\n');
}

async function importHmacKey(signSecret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', utf8(signSecret) as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign'
  ]);
}

/** Base64(HMAC_SHA256(...))，与 Node createHmac 行为一致 */
export async function signCanonical(signSecret: string, canonical: string): Promise<string> {
  const key = await importHmacKey(signSecret);
  const sig = await crypto.subtle.sign('HMAC', key, utf8(canonical) as BufferSource);
  return bytesToBase64(new Uint8Array(sig));
}

export async function buildL2Signature(
  signSecret: string,
  input: { method: string; pathWithQuery: string; timestamp: string; nonce: string; bodyJson: string }
): Promise<string> {
  const bodyJson = input.bodyJson;
  const bodyHash = await sha256HexOfString(bodyJson);
  const canonical = buildCanonicalString(input.method, input.pathWithQuery, input.timestamp, input.nonce, bodyHash);
  return signCanonical(signSecret, canonical);
}

async function importAesGcmKey(keyB64: string): Promise<CryptoKey> {
  const raw = base64ToBytes(keyB64);
  if (raw.length !== 32) {
    throw new Error('Invalid AES-256 key length (expect 32 bytes base64)');
  }
  return crypto.subtle.importKey('raw', raw as BufferSource, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encryptPlainObjectToPayload(
  plain: unknown,
  aad: { method: string; path: string; timestamp: string; nonce: string },
  kid: string,
  keyBase64: string
): Promise<CipherPayload> {
  const key = await importAesGcmKey(keyBase64);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aadStr = JSON.stringify(aad);
  const aadBytes = utf8(aadStr);
  const plainBytes = utf8(JSON.stringify(plain ?? {}));
  const alg: AesGcmParams = {
    name: 'AES-GCM',
    iv: iv as BufferSource,
    additionalData: aadBytes as BufferSource,
    tagLength: 128
  };
  const cipherBuf = await crypto.subtle.encrypt(alg, key, plainBytes as BufferSource);
  const all = new Uint8Array(cipherBuf);
  const tag = all.slice(all.length - 16);
  const ciphertext = all.slice(0, all.length - 16);
  return {
    alg: 'A256GCM',
    kid,
    iv: bytesToBase64(iv),
    aad: bytesToBase64(aadBytes),
    ciphertext: bytesToBase64(ciphertext),
    tag: bytesToBase64(tag)
  };
}

export async function decryptPayloadToString(payload: CipherPayload, keyBase64: string): Promise<string> {
  if (payload.alg !== 'A256GCM') {
    throw new Error('Unsupported payload alg');
  }
  const key = await importAesGcmKey(keyBase64);
  const iv = base64ToBytes(payload.iv);
  const aad = base64ToBytes(payload.aad);
  const ciphertext = base64ToBytes(payload.ciphertext);
  const tag = base64ToBytes(payload.tag);
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext, 0);
  combined.set(tag, ciphertext.length);
  const alg: AesGcmParams = {
    name: 'AES-GCM',
    iv: iv as BufferSource,
    additionalData: aad as BufferSource,
    tagLength: 128
  };
  const plain = await crypto.subtle.decrypt(alg, key, combined as BufferSource);
  return new TextDecoder().decode(plain);
}

export function isCipherPayload(x: unknown): x is CipherPayload {
  if (!x || typeof x !== 'object') return false;
  const o = x as CipherPayload;
  return o.alg === 'A256GCM' && typeof o.kid === 'string' && typeof o.ciphertext === 'string';
}
