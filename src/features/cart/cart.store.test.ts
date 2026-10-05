/* eslint-disable import/first -- jest.mock calls must run before the imports they replace */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { CartLine } from "@/lib/types/cart";

jest.mock("@/api/auth-client", () => ({ authClient: { getCookie: jest.fn(async () => "") } }));
jest.mock("sonner-native", () => {
  const toast = Object.assign(jest.fn(), { success: jest.fn(), error: jest.fn() });
  return { toast };
});
jest.mock("./cart.api", () => ({
  fetchCart: jest.fn(),
  addCartItem: jest.fn(),
  setCartItemQuantity: jest.fn(),
  removeCartItem: jest.fn(),
  mergeGuestCart: jest.fn(),
  resolveGuestCart: jest.fn(),
}));

import { toast } from "sonner-native";
import * as api from "./cart.api";
import { selectCount, selectSubtotal, useCartStore, type AddableProduct } from "./cart.store";

const product = (over: Partial<AddableProduct> = {}): AddableProduct => ({
  id: "p1",
  slug: "bowl",
  name: "Bowl",
  imageUrl: null,
  imageAlt: "Bowl",
  price: 500_000,
  stock: 5,
  ...over,
});
const line = (over: Partial<CartLine> = {}): CartLine => ({
  productId: "p1",
  slug: "bowl",
  name: "Bowl",
  imageUrl: null,
  imageAlt: "Bowl",
  unitPrice: 500_000,
  quantity: 1,
  stock: 5,
  available: true,
  ...over,
});

const mocked = <T extends (...a: never[]) => unknown>(fn: T) => fn as unknown as jest.Mock<T>;

beforeEach(() => {
  jest.clearAllMocks();
  useCartStore.getState().reset();
});

describe("guest bag", () => {
  it("adds, merges the same product, and caps at stock", async () => {
    const { add } = useCartStore.getState();
    expect(await add(product({ stock: 2 }))).toBe(true);
    expect(await add(product({ stock: 2 }))).toBe(true);
    expect(useCartStore.getState().lines[0]!.quantity).toBe(2);
    expect(await add(product({ stock: 2 }))).toBe(false); // already at the cap
    expect(toast).toHaveBeenCalledWith("You already have all 2 of Bowl in your bag.");
    expect(api.addCartItem).not.toHaveBeenCalled(); // guests never hit the server
  });

  it("refuses sold-out products", async () => {
    expect(await useCartStore.getState().add(product({ stock: 0 }))).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Bowl is sold out.");
    expect(useCartStore.getState().lines).toHaveLength(0);
  });

  it("bumps the badge counter on every successful add", async () => {
    const before = useCartStore.getState().bumpKey;
    await useCartStore.getState().add(product());
    expect(useCartStore.getState().bumpKey).toBe(before + 1);
  });

  it("clamps quantity to stock, and removing offers Undo", async () => {
    useCartStore.setState({ lines: [line({ stock: 3, quantity: 1 })] });
    await useCartStore.getState().setQuantity("p1", 9);
    expect(useCartStore.getState().lines[0]!.quantity).toBe(3);

    await useCartStore.getState().setQuantity("p1", 0); // 0 = remove
    expect(useCartStore.getState().lines).toHaveLength(0);
    const [, options] = mocked(toast as never).mock.calls.at(-1) as unknown as [
      string,
      { action: { label: string; onClick: () => void } },
    ];
    expect(options.action.label).toBe("Undo");
    options.action.onClick();
    await Promise.resolve();
    expect(useCartStore.getState().lines[0]).toMatchObject({ productId: "p1", quantity: 3 });
  });

  it("counts and totals only available lines", () => {
    useCartStore.setState({
      lines: [
        line({ quantity: 2 }),
        line({ productId: "p2", quantity: 1, unitPrice: 100_000, available: false }),
      ],
    });
    expect(selectCount(useCartStore.getState())).toBe(2);
    expect(selectSubtotal(useCartStore.getState())).toBe(1_000_000);
  });
});

describe("signed-in bag (server confirms)", () => {
  beforeEach(() => {
    useCartStore.setState({ isAuthenticated: true });
  });

  it("applies the change instantly, then takes the server's answer", async () => {
    mocked(api.addCartItem).mockResolvedValue([line({ quantity: 1, unitPrice: 450_000 })] as never);
    await useCartStore.getState().add(product());
    expect(useCartStore.getState().lines[0]!.unitPrice).toBe(450_000); // server price wins
  });

  it("rolls back to the server's bag and toasts when the server refuses", async () => {
    const { ApiError } = jest.requireActual<typeof import("@/api/client")>("@/api/client");
    mocked(api.addCartItem).mockRejectedValue(new ApiError("Only 1 left.", 409));
    mocked(api.fetchCart).mockResolvedValue([] as never);
    expect(await useCartStore.getState().add(product())).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Only 1 left.");
    expect(useCartStore.getState().lines).toEqual([]);
  });
});

describe("init", () => {
  it("merges a guest bag into the account on sign-in", async () => {
    useCartStore.setState({ lines: [line({ quantity: 2 })] });
    mocked(api.mergeGuestCart).mockResolvedValue([line({ quantity: 2 })] as never);
    await useCartStore.getState().init(true);
    expect(api.mergeGuestCart).toHaveBeenCalledWith([{ productId: "p1", quantity: 2 }]);
    expect(useCartStore.getState()).toMatchObject({ isAuthenticated: true, ready: true });
    expect(toast.success).toHaveBeenCalledWith("Your bag was saved to your account");
  });

  it("keeps the guest bag if the merge fails", async () => {
    useCartStore.setState({ lines: [line()] });
    mocked(api.mergeGuestCart).mockRejectedValue(new Error("offline"));
    await useCartStore.getState().init(true);
    expect(useCartStore.getState().isAuthenticated).toBe(false);
    expect(useCartStore.getState().lines).toHaveLength(1);
    expect(useCartStore.getState().ready).toBe(true);
  });
});
