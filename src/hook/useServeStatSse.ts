import type { ServeStatInfo, ServerInfoDTO } from '@/api/client/DTO/serverInfoDTO';
import RequestUrl from '@/api/client/url';
import { FetchClientError } from '@/api/feachHook/types';
import { $t } from '@/locale';
import { RoutesAlias } from '@/router/router';
import { useUserStore } from '@/store/modules/user';
import { router } from '@/router';
import { showErrorMessage } from '@/utils/message';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import { normalizeAcceptLanguage, normalizeBearerToken } from '@/api/client/headerSanitizer';

const DEFAULT_INTERVAL_MS = 3000;

export interface UseServeStatSseOptions {
  /** 采集间隔（毫秒），服务端限制 1000–120000，默认 3000 */
  intervalMs?: number;
  /**
   * 建立连接失败时的重试次数（不含首次），默认 0。
   * 仅对 **fetch 阶段** 生效：网络异常、HTTP 5xx；**不会**重试 401 / 403 / 404。
   */
  retryCount?: number;
  /** 重试间隔（毫秒），默认 1500 */
  retryDelayMs?: number;
}

export interface UseServeStatSseResult {
  /** 最近一次成功解析的 `stat` 事件数据（包装为与旧 HTTP 接口一致的 DTO 形状） */
  data: Ref<ServerInfoDTO | undefined>;
  loading: Ref<boolean>;
  /** 最终失败时非 undefined；类型见 {@link FetchClientError}，`message` 可为 i18n key */
  error: Ref<FetchClientError | undefined>;
}

function isAbortError(e: unknown): boolean {
  return (e instanceof DOMException && e.name === 'AbortError') || (e instanceof Error && e.name === 'AbortError');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** 将缓冲区按 SSE 消息块拆分，返回未完成尾部与已完整消息块 */
function splitSseBlocks(buffer: string): { rest: string; blocks: string[] } {
  const normalized = buffer.replace(/\r\n/g, '\n');
  const parts = normalized.split('\n\n');
  const rest = parts.pop() ?? '';
  return { rest, blocks: parts.filter(b => b.trim().length > 0) };
}

function parseSseBlock(block: string): { event: string; data: string } | null {
  const lines = block.split('\n');
  let event = 'message';
  const dataLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).replace(/^\s/, ''));
    }
  }
  if (!dataLines.length) return null;
  return { event, data: dataLines.join('\n') };
}

function resolveServeStatUrl(intervalMs: number): string {
  const base =
    import.meta.env.VITE_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  const url = new URL(RequestUrl.getServerInfo, base);
  url.searchParams.set('intervalMs', String(intervalMs));
  return url.href;
}

/** 从 Nest / 统一包装 JSON 中提取 `message`（兼容 string 与 string[]） */
function extractMessageFromJsonBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;
  const raw = o.message ?? o.error;
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && raw.length && raw.every((x): x is string => typeof x === 'string')) {
    return raw.join('; ');
  }
  return null;
}

/**
 * 鉴权与 Guard 在 **开始写 SSE 流之前** 失败时，响应仍是普通 HTTP，body 多为 JSON，可解析。
 * 只读一次 `Response` body（`text()`）。
 */
async function readHttpErrorMessage(res: Response): Promise<string | null> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    const body = JSON.parse(text) as unknown;
    return extractMessageFromJsonBody(body);
  } catch {
    if (text.length < 2000) return text.trim();
    return null;
  }
}

function shouldRetryHttpStatus(status: number): boolean {
  return status >= 500 && status <= 599;
}

/** 与 `error.httpRequestFailed` 文案中的 `{status}` 占位符对应 */
function tHttpRequestFailed(status: number): string {
  return $t('error.httpRequestFailed').replace(/\{status\}/g, String(status));
}

/**
 * 订阅服务器状态 SSE（`GET .../system/serve/start`，事件名 `stat`），需 Bearer JWT。
 * 浏览器无法用 EventSource 带 Authorization，故使用 fetch 流式解析。
 *
 * **失败重试**：仅针对建立连接阶段（`fetch` 抛错或返回可重试的 5xx）；默认不重试。
 * **失败结果**：`error` 为 {@link FetchClientError}；`HANDLED_ERROR` 表示已在内部提示并处理登录/跳转。
 */
export function useServeStatSse(options: UseServeStatSseOptions = {}): UseServeStatSseResult {
  const data = ref<ServerInfoDTO | undefined>();
  const loading = ref(true);
  const error = ref<FetchClientError | undefined>();

  let abortController: AbortController | null = null;

  async function handleHttpError(res: Response, serverMsg: string | null): Promise<void> {
    loading.value = false;
    const userStore = useUserStore();

    if (res.status === 401) {
      const display = serverMsg ?? $t('error.authSessionExpired');
      showErrorMessage(display);
      const currentPath = router.currentRoute.value.path;
      const isOnLoginPage = currentPath === RoutesAlias.Login;
      if (userStore.isLogin) {
        userStore.logout();
      } else if (!isOnLoginPage) {
        router.replace({ path: RoutesAlias.Login });
      }
      error.value = new FetchClientError('HANDLED_ERROR', '');
      return;
    }

    if (res.status === 403) {
      const display = serverMsg ?? $t('error.forbidden');
      showErrorMessage(display);
      error.value = new FetchClientError('HANDLED_ERROR', '');
      return;
    }

    const fallbackMsg = tHttpRequestFailed(res.status);
    const display = serverMsg ?? fallbackMsg;
    showErrorMessage(display);
    error.value = new FetchClientError('CLIENT_ERROR', serverMsg ?? fallbackMsg);
  }

  async function connect(): Promise<void> {
    const userStore = useUserStore();
    if (!userStore.isLogin) {
      loading.value = false;
      error.value = new FetchClientError('OTHER_ERROR', 'error.serveStatNotLoggedIn');
      showErrorMessage($t('error.serveStatNotLoggedIn'));
      return;
    }

    const rawInterval = options.intervalMs ?? DEFAULT_INTERVAL_MS;
    const intervalMs = Math.min(120000, Math.max(1000, rawInterval));
    const maxAttempts = (options.retryCount ?? 0) + 1;
    const retryDelayMs = options.retryDelayMs ?? 1500;

    abortController = new AbortController();

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (attempt > 0) {
        await sleep(retryDelayMs);
        if (abortController.signal.aborted) return;
      }

      try {
        let token = userStore.getAccessToken;
        try {
          token = normalizeBearerToken(token);
        } catch {
          // token 异常时直接清理登录态，避免 fetch 在 headers 阶段直接抛错
          userStore.logout();
          loading.value = false;
          error.value = new FetchClientError('HANDLED_ERROR', '');
          showErrorMessage($t('error.authSessionExpired'));
          return;
        }

        const res = await fetch(resolveServeStatUrl(intervalMs), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept-Language': normalizeAcceptLanguage(userStore.getCurrentLocale),
            Accept: 'text/event-stream'
          },
          signal: abortController.signal
        });

        if (!res.ok) {
          const serverMsg = await readHttpErrorMessage(res);
          const canRetry =
            attempt < maxAttempts - 1 && shouldRetryHttpStatus(res.status) && res.status !== 401 && res.status !== 403;

          if (canRetry) {
            continue;
          }

          await handleHttpError(res, serverMsg);
          return;
        }

        const body = res.body;
        if (!body) {
          loading.value = false;
          const key = 'error.serveStatEmptyBody';
          error.value = new FetchClientError('OTHER_ERROR', key);
          showErrorMessage($t(key));
          return;
        }

        const reader = body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const { rest, blocks } = splitSseBlocks(buffer);
          buffer = rest;

          for (const block of blocks) {
            const parsed = parseSseBlock(block);
            if (!parsed || parsed.event !== 'stat') continue;
            try {
              const stat = JSON.parse(parsed.data) as ServeStatInfo;
              data.value = {
                code: 200,
                message: 'ok',
                data: stat
              };
              loading.value = false;
              error.value = undefined;
            } catch {
              // 跳过非法 JSON 块
            }
          }
        }
        return;
      } catch (e) {
        if (isAbortError(e)) return;

        const last = attempt >= maxAttempts - 1;
        if (!last) {
          continue;
        }

        if (e instanceof FetchClientError) {
          error.value = e;
        } else {
          const msg = e instanceof Error ? e.message : '';
          error.value = new FetchClientError('OTHER_ERROR', msg || 'error.networkError');
          showErrorMessage(msg ? msg : $t('error.networkError'));
        }
        loading.value = false;
        return;
      }
    }
  }

  onMounted(() => {
    void connect();
  });

  onUnmounted(() => {
    abortController?.abort();
  });

  return { data, loading, error };
}
