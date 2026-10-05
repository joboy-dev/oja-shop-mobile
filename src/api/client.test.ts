/* eslint-disable import/first -- jest.mock calls must run before the imports they replace */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("./auth-client", () => ({
  authClient: { getCookie: jest.fn(async () => "oja.session_token=abc") },
}));
jest.mock("./env", () => ({ API_URL: "https://shop.test" }));

import { ApiError, apiFetch } from "./client";

const mockFetch = jest.fn<typeof fetch>();
const json = (body: unknown, status = 200) => ({ status, json: async () => body }) as Response;

beforeEach(() => {
  mockFetch.mockReset();
  global.fetch = mockFetch;
});
afterEach(() => {
  jest.useRealTimers();
});

describe("apiFetch", () => {
  it("returns data from the ActionResult envelope", async () => {
    mockFetch.mockResolvedValue(json({ ok: true, data: { hello: "world" } }));
    await expect(apiFetch("/home")).resolves.toEqual({ hello: "world" });
  });

  it("builds the URL, sends the session cookie by hand, and skips empty query values", async () => {
    mockFetch.mockResolvedValue(json({ ok: true, data: [] }));
    await apiFetch("/products", { query: { q: "bowl", page: 2, sort: undefined, category: "" } });
    const [url, init] = mockFetch.mock.calls[0]!;
    expect(url).toBe("https://shop.test/api/v1/products?q=bowl&page=2");
    expect(init?.credentials).toBe("omit");
    expect((init?.headers as Record<string, string>).Cookie).toBe("oja.session_token=abc");
  });

  it("sends JSON bodies", async () => {
    mockFetch.mockResolvedValue(json({ ok: true, data: null }));
    await apiFetch("/cart/items", { method: "POST", body: { productId: "p", quantity: 1 } });
    const [, init] = mockFetch.mock.calls[0]!;
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(JSON.stringify({ productId: "p", quantity: 1 }));
    expect((init?.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
  });

  it("throws ApiError with message, status and field errors for ok:false", async () => {
    mockFetch.mockResolvedValue(
      json(
        {
          ok: false,
          error: "Please check the highlighted fields.",
          fieldErrors: { phone: ["Enter a valid phone"] },
        },
        400,
      ),
    );
    const err = await apiFetch("/checkout", { method: "POST", body: {} }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({
      message: "Please check the highlighted fields.",
      status: 400,
      fieldErrors: { phone: ["Enter a valid phone"] },
    });
    expect((err as ApiError).retryable).toBe(false);
  });

  it("marks 401 as unauthorized and 5xx as retryable", async () => {
    mockFetch.mockResolvedValueOnce(json({ ok: false, error: "Sign in to continue." }, 401));
    expect(await apiFetch("/cart").catch((e: unknown) => e)).toMatchObject({
      isUnauthorized: true,
      retryable: false,
    });
    mockFetch.mockResolvedValueOnce(json({ ok: false, error: "Something went wrong." }, 500));
    expect(await apiFetch("/cart").catch((e: unknown) => e)).toMatchObject({ retryable: true });
  });

  it("turns a network failure into a friendly, retryable ApiError", async () => {
    mockFetch.mockRejectedValue(new TypeError("Network request failed"));
    const err = await apiFetch("/home").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({
      status: 0,
      retryable: true,
      message: "Can't reach the shop. Check your connection.",
    });
  });

  it("handles a non-JSON response", async () => {
    mockFetch.mockResolvedValue({
      status: 502,
      json: async () => {
        throw new Error("bad json");
      },
    } as unknown as Response);
    expect(await apiFetch("/home").catch((e: unknown) => e)).toMatchObject({ status: 502, retryable: true });
  });
});
