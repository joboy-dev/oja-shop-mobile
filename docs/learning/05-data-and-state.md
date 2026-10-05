# 05 · Data and state

Two kinds of state, two tools:

| Kind | Tool | Example |
|---|---|---|
| **Server state** (owned by the server, cached on the phone) | TanStack Query | products, orders, addresses, wishlist ids |
| **Client state** (owned by the device) | Zustand (+ AsyncStorage) | guest bag, theme choice, recent searches |

## TanStack Query — what the web gets from Server Components + `revalidateTag`
`useQuery({ queryKey, queryFn })` gives `data / isPending / isError / refetch`. Keys live in `src/api/query-keys.ts`;
invalidating a key refetches it (`queryClient.invalidateQueries`). Mobile specifics (`api/query-client.ts`):
`focusManager` ← app foreground, `onlineManager` ← NetInfo, retries only `retryable` errors.

`useProducts` is `useInfiniteQuery` (page param → `onEndReached` → `fetchNextPage`) with
`placeholderData: keepPreviousData` so changing a filter dims the old list instead of flashing a skeleton.

## The bag (`features/cart/cart.store.ts`)
A port of the web's store. Guests: lines in AsyncStorage. Signed in: server bag, and on sign-in the guest lines are
**merged**. Each change is **optimistic** (UI first), then confirmed; on error → toast + re-read the server bag. A
promise **queue** keeps rapid taps ordered. `cart.store.test.ts` covers the rules.

## Optimistic wishlist
`useToggleWishlist`: `onMutate` flips the id list and returns a snapshot; `onError` restores it; `onSettled` refetches.
This is the standard TanStack pattern — read it once, reuse it everywhere.

## Pull-to-refresh, skeleton, empty, error
Every screen has all four. Search for `ErrorState`, `EmptyState`, `Skeleton`.

## Exercises
1. Make Orders refetch when the app returns to the foreground (hint: it already does; find where and why).
2. Add `staleTime: 5 * 60_000` to `useHome` and watch network calls while switching tabs.
3. Write an optimistic "mark address default" in `addresses.queries.ts`.
