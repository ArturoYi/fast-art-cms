import { LANGUAGE } from '@/locale';
import { FetchClientError } from '@/api/feachHook/types';

function hasNonLatin1CodePoint(input: string): boolean {
  for (let i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) > 255) return true;
  }
  return false;
}

/**
 * 将任意“语言标识/显示文案”收敛为可用于 HTTP header 的 IETF BCP47 tag（ASCII）。
 * - 支持：'zh-CN'/'en-US'/'ar-DZ'
 * - 兼容：'中文(简体)'、'English' 等显示值（防止误写入 store）
 */
export function normalizeAcceptLanguage(value: unknown): LANGUAGE {
  const raw = String(value ?? '').trim();
  if (!raw) return LANGUAGE.ZH_CN;

  // 已是枚举值（标准 tag）
  if (raw === LANGUAGE.ZH_CN || raw === LANGUAGE.EN_US || raw === LANGUAGE.AR_DZ) {
    return raw as LANGUAGE;
  }

  // 容错：有人把 label 写进去了
  const lower = raw.toLowerCase();
  if (lower.includes('zh') || raw.includes('中文')) return LANGUAGE.ZH_CN;
  if (lower.includes('en') || lower.includes('english')) return LANGUAGE.EN_US;
  if (lower.includes('ar') || raw.includes('阿拉伯')) return LANGUAGE.AR_DZ;

  // 最后兜底：避免非 Latin-1 导致 fetch 直接抛错
  if (hasNonLatin1CodePoint(raw)) return LANGUAGE.ZH_CN;
  return LANGUAGE.ZH_CN;
}

/**
 * 规范化 JWT access token（用于 Authorization header）。
 * 若检测到会导致 fetch 构造 headers 失败的字符，则抛出错误（上层应清理登录态）。
 */
export function normalizeBearerToken(value: unknown): string {
  const token = String(value ?? '').trim();
  if (!token) return '';

  // 关键：浏览器 fetch 的 header value 不能包含超出 Latin-1 的码点
  if (hasNonLatin1CodePoint(token)) {
    throw new FetchClientError('OTHER_ERROR', 'error.invalidAuthToken');
  }

  // 额外防护：去掉明显不应存在的空白控制字符（避免一些浏览器/代理直接拒绝）
  const cleaned = token.replace(/[\r\n\t]/g, '').trim();
  return cleaned;
}
