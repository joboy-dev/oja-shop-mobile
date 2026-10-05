# 07 · Forms and checkout

## Forms
`react-hook-form` + `zodResolver(schema)` — the **same zod schemas as the web** (synced into `src/lib/validators`).
RN has no `register()`; use `Controller` (wrapped once in `components/forms/FormInput.tsx`). Server `fieldErrors` from a
400 are shown under the matching field.

`Field` = label + control + hint/error (announces errors to screen readers). `Input` shows focus/error with its border.
Keyboards: `keyboardType="phone-pad"`, `autoComplete="tel"`, `autoCapitalize="none"`.

## Keyboard handling
`KeyboardAwareScrollView` (react-native-keyboard-controller) scrolls the focused field into view; bottom sheets use
`keyboardBehavior="interactive"`. The address form is a **route modal**, not a sheet-in-a-sheet, because nesting sheets
and keyboards is fragile.

## Checkout (`features/checkout/components/CheckoutFlow.tsx`)
Port of the web flow: 4 `StepCard`s. Per-step validation = `form.trigger([fields])`. Completed steps collapse to one-line
summaries with Edit.

Safety on a flaky network:
- an **idempotency key** (uuid) is generated once per checkout session and sent with the order; the server returns the
  same order if the request is repeated.
- the key is **kept** when the failure is retryable (offline/5xx — it may have reached the server) and **discarded**
  when the server clearly refused (4xx).
- after success: clear the local bag, invalidate orders/addresses, `router.replace` to the success screen.

## Exercises
1. Add an "Apt/floor" hint to the address form and show it in the checkout step summary.
2. Simulate airplane mode during "Place order". What does the user see? Retry — confirm one order.
3. Add a zod rule to `contactSchema` in the web repo, run `npm run sync:shared`, and watch the mobile form pick it up.
