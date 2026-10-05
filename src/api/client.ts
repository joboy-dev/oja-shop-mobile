import type { ActionResult } from "@/lib/types/action-result";
import { authClient } from "./auth-client";
import { API_URL } from "./env";

const TIMEOUT_MS = 15_000;

/**
 * Anything that stops us getting a normal answer from /api/v1:
 *  - network / timeout / 5xx are `retryable` (TanStack Query will retry these),
 *  - 4xx are the server telling us "no" (validation, auth, not found, stock): show `message`,
 *    and use `fieldErrors` to mark form fields.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
  get retryable() {
    return this.status === 0 || this.status >= 500;
  }
  get isUnauthorized() {
    return this.status === 401;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const params = Object.entries(query ?? {}).filter(([, v]) => v !== undefined && v !== "");
  const qs = params.length
    ? `?${new URLSearchParams(params.map(([k, v]) => [k, String(v)])).toString()}`
    : "";
  return `${API_URL}/api/v1${path}${qs}`;
}

/**
 * Calls the web app's JSON API and returns `data`, or throws ApiError.
 * The session cookie lives in SecureStore (managed by Better Auth), so we attach it by hand and tell
 * fetch not to touch cookies itself.
 */
export async function apiFetch<T>(
  path: string,
  { method = "GET", body, query, signal }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener("abort", () => controller.abort());

  // SecureStore can be unavailable (web preview) or fail to read: treat that as "signed out", not as a crash.
  const cookie = await authClient.getCookie().catch(() => "");
  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      credentials: "omit",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (signal?.aborted) throw err; // a cancelled query, not a failure
    const timedOut = controller.signal.aborted;
    throw new ApiError(
      timedOut
        ? "The shop took too long to respond. Try again."
        : "Can't reach the shop. Check your connection.",
      0,
    );
  } finally {
    clearTimeout(timeout);
  }

  let result: ActionResult<T>;
  try {
    result = (await res.json()) as ActionResult<T>;
  } catch {
    throw new ApiError("The shop sent something we couldn't read. Try again.", res.status || 500);
  }

  if (!result.ok) throw new ApiError(result.error, res.status, result.fieldErrors);
  return result.data;
}
