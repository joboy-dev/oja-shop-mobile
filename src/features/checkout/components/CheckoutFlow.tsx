import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import { ArrowRight, Lock, ShoppingBag } from "lucide-react-native";
import { useRef, useState } from "react";
import { Controller, type Control, type FieldValues } from "react-hook-form";
import { View } from "react-native";
import { toast } from "sonner-native";
import { ApiError } from "@/api/client";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Input, Textarea } from "@/components/ui/Input";
import { RadioCard, RadioCardGroup } from "@/components/ui/RadioCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import { qk } from "@/api/query-keys";
import { AddressFields } from "@/features/addresses";
import { selectCount, useCartStore } from "@/features/cart";
import { useZodForm } from "@/hooks/useZodForm";
import {
  paymentMethods,
  shippingMethods,
  type PaymentMethodId,
  type ShippingMethodId,
} from "@/lib/config/shop";
import { calculateTotals } from "@/lib/pricing/calculate-totals";
import type { AddressDTO } from "@/lib/types/address";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators/checkout";
import { formatMoney } from "@/utils/money";
import { placeOrder } from "../checkout.api";
import { CheckoutProgress } from "./CheckoutProgress";
import { OrderSummaryBar } from "./OrderSummaryBar";
import { StepCard } from "./StepCard";

type Choice = string; // an address id, or "new"

const newAddress = (name: string, phone: string) => ({
  mode: "new" as const,
  fullName: name,
  phone,
  line1: "",
  line2: "",
  city: "",
  state: undefined,
  postalCode: "",
  save: true,
});

/** Four steps (contact → address → delivery → review & pay) on one screen. Port of the web CheckoutFlow. */
export function CheckoutFlow({
  user,
  addresses,
}: {
  user: { name: string; email: string; phone: string | null };
  addresses: AddressDTO[];
}) {
  const router = useRouter();
  const qc = useQueryClient();
  const ready = useCartStore((s) => s.ready);
  const authenticated = useCartStore((s) => s.isAuthenticated);
  const lines = useCartStore((s) => s.lines);
  const count = useCartStore(selectCount);

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [choice, setChoice] = useState<Choice>(defaultAddress?.id ?? "new");
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState<string>();
  const key = useRef<string | null>(null);

  const form = useZodForm(checkoutSchema, {
    phone: user.phone ?? "",
    address: defaultAddress
      ? { mode: "saved" as const, addressId: defaultAddress.id }
      : newAddress(user.name, user.phone ?? ""),
    shippingMethod: "standard",
    paymentMethod: "pay_on_delivery",
    notes: "",
    idempotencyKey: "pending-key-placeholder",
  } as never);
  const { watch, trigger, setValue, control, handleSubmit, formState } = form;
  const loose = control as unknown as Control<FieldValues>;

  const shippingMethod = (watch("shippingMethod") ?? "standard") as ShippingMethodId;
  const paymentMethod = (watch("paymentMethod") ?? "pay_on_delivery") as PaymentMethodId;
  const phone = (watch("phone") as string) ?? "";
  const draft = watch("address") as Record<string, unknown>;

  const buyable = lines.filter((l) => l.available);
  const priced = buyable.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity }));
  const totals = calculateTotals(priced, shippingMethod);

  const placeMutation = useMutation({ mutationFn: placeOrder });

  const chooseAddress = (value: Choice) => {
    setChoice(value);
    setValue(
      "address" as never,
      (value === "new" ? newAddress(user.name, phone) : { mode: "saved", addressId: value }) as never,
    );
  };

  const fieldsFor = (s: number): string[] => {
    if (s === 1) return ["phone"];
    if (s === 2)
      return choice === "new"
        ? ["address.fullName", "address.phone", "address.line1", "address.city", "address.state"]
        : ["address.addressId"];
    if (s === 3) return ["shippingMethod"];
    return [];
  };

  const next = async () => {
    if (await trigger(fieldsFor(step) as never)) setStep((s) => s + 1);
  };

  const placeOrderNow = () =>
    void handleSubmit(async (values) => {
      setServerError(undefined);
      key.current ??= Crypto.randomUUID();
      try {
        const res = await placeMutation.mutateAsync({
          ...values,
          idempotencyKey: key.current,
        } as unknown as CheckoutInput);
        useCartStore.getState().clearLocal();
        void qc.invalidateQueries({ queryKey: qk.orders.all });
        void qc.invalidateQueries({ queryKey: qk.addresses });
        router.replace({
          pathname: "/checkout/success/[orderNumber]",
          params: { orderNumber: res.orderNumber },
        });
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "We couldn't place your order. You haven't been charged. Please try again.";
        // A retryable failure (offline, timeout) may have reached the server: keep the key so a retry can't double-order.
        if (!(err instanceof ApiError && err.retryable)) key.current = null;
        setServerError(message);
        toast.error(message);
        void useCartStore.getState().refresh(); // the server may have trimmed or removed lines
      }
    })();

  if (!ready || !authenticated) {
    return (
      <View className="gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-sheet" />
        ))}
      </View>
    );
  }

  if (buyable.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your bag is empty"
        description="Add something from the shop and come back to check out."
        action={
          <Button size="lg" href="/shop">
            Browse the shop
          </Button>
        }
      />
    );
  }

  const selected = addresses.find((a) => a.id === choice);
  const addressSummary =
    choice === "new"
      ? `${String(draft?.fullName ?? "")}, ${String(draft?.line1 ?? "")}, ${String(draft?.city ?? "")}, ${String(draft?.state ?? "")}`
      : selected
        ? `${selected.fullName}, ${selected.line1}, ${selected.city}, ${selected.state}`
        : "";
  const addressIdError = (formState.errors as { address?: { addressId?: { message?: string } } }).address
    ?.addressId?.message;

  return (
    <View className="gap-4">
      <CheckoutProgress step={step} />
      <OrderSummaryBar lines={buyable} totals={totals} />

      {/* 1 · Contact */}
      <StepCard
        index={1}
        title="Contact"
        state={step === 1 ? "active" : "done"}
        onEdit={() => setStep(1)}
        summary={`${user.email} · ${phone}`}
      >
        <View className="gap-5">
          <Field label="Email" hint="Your confirmation is sent here.">
            <Input value={user.email} editable={false} />
          </Field>
          <FormInput
            control={control}
            name="phone"
            label="Phone number"
            required
            keyboardType="phone-pad"
            autoComplete="tel"
            placeholder="0803 123 4567"
          />
          <Button size="lg" onPress={next} endIcon={<Icon as={ArrowRight} size={20} tone="on-primary" />}>
            Continue to address
          </Button>
        </View>
      </StepCard>

      {/* 2 · Address */}
      <StepCard
        index={2}
        title="Delivery address"
        state={step === 2 ? "active" : step > 2 ? "done" : "upcoming"}
        onEdit={() => setStep(2)}
        summary={addressSummary}
      >
        <View className="gap-5">
          {addresses.length > 0 && (
            <RadioCardGroup label="Delivery address">
              {addresses.map((a) => (
                <RadioCard
                  key={a.id}
                  selected={choice === a.id}
                  onSelect={() => chooseAddress(a.id)}
                  title={a.fullName}
                  description={`${a.line1}${a.line2 ? `, ${a.line2}` : ""}, ${a.city}, ${a.state} · ${a.phone}`}
                />
              ))}
              <RadioCard
                selected={choice === "new"}
                onSelect={() => chooseAddress("new")}
                title="Use a different address"
                description="Add a new delivery address"
              />
            </RadioCardGroup>
          )}
          {addressIdError && (
            <Text variant="caption" tone="danger" accessibilityRole="alert">
              {addressIdError}
            </Text>
          )}

          {choice === "new" && (
            <>
              <AddressFields control={loose} prefix="address." />
              <Controller
                control={loose}
                name="address.save"
                render={({ field }) => (
                  <Checkbox
                    label="Save this address for next time"
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </>
          )}
          <Button size="lg" onPress={next} endIcon={<Icon as={ArrowRight} size={20} tone="on-primary" />}>
            Continue to delivery
          </Button>
        </View>
      </StepCard>

      {/* 3 · Delivery */}
      <StepCard
        index={3}
        title="Delivery"
        state={step === 3 ? "active" : step > 3 ? "done" : "upcoming"}
        onEdit={() => setStep(3)}
        summary={`${shippingMethods[shippingMethod].label}, ${shippingMethods[shippingMethod].description}`}
      >
        <View className="gap-5">
          <Controller
            control={control}
            name="shippingMethod"
            render={({ field }) => (
              <RadioCardGroup label="Delivery option">
                {Object.values(shippingMethods).map((m) => {
                  const fee = calculateTotals(priced, m.id).shippingFee;
                  return (
                    <RadioCard
                      key={m.id}
                      selected={field.value === m.id}
                      onSelect={() => field.onChange(m.id)}
                      title={m.label}
                      description={m.description}
                      aside={fee === 0 ? "Free" : formatMoney(fee)}
                    />
                  );
                })}
              </RadioCardGroup>
            )}
          />
          <Button size="lg" onPress={next} endIcon={<Icon as={ArrowRight} size={20} tone="on-primary" />}>
            Continue to review
          </Button>
        </View>
      </StepCard>

      {/* 4 · Review & pay */}
      <StepCard index={4} title="Review & pay" state={step === 4 ? "active" : "upcoming"}>
        <View className="gap-5">
          <Text variant="label" className="text-[16px]">
            How would you like to pay?
          </Text>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <RadioCardGroup label="Payment method">
                {Object.values(paymentMethods).map((m) => (
                  <RadioCard
                    key={m.id}
                    selected={field.value === m.id}
                    onSelect={() => field.onChange(m.id)}
                    title={m.label}
                    description={m.description}
                  />
                ))}
              </RadioCardGroup>
            )}
          />
          <Controller
            control={control}
            name="notes"
            render={({ field, fieldState }) => (
              <Field label="Delivery notes (optional)" error={fieldState.error?.message}>
                <Textarea
                  value={field.value ?? ""}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Gate code, best time to call, landmarks…"
                />
              </Field>
            )}
          />

          {paymentMethod === "bank_transfer" && (
            <View className="rounded-control bg-primary-soft px-4 py-3">
              <Text variant="caption">
                We&apos;ll show our account details on the next page and email them to you. Your order ships
                once the transfer lands.
              </Text>
            </View>
          )}
          {serverError && (
            <View accessibilityRole="alert" className="rounded-control bg-danger-soft px-4 py-3">
              <Text variant="caption" tone="danger" className="font-sans-medium">
                {serverError}
              </Text>
            </View>
          )}

          <Button
            size="lg"
            fullWidth
            isLoading={placeMutation.isPending}
            haptic="medium"
            startIcon={<Icon as={Lock} size={16} tone="on-primary" />}
            onPress={placeOrderNow}
          >
            {`Place order · ${formatMoney(totals.total)}`}
          </Button>
          <Text variant="caption" tone="muted" className="text-center text-[12px]">
            {`By placing your order you agree to our terms and returns policy. ${count} ${count === 1 ? "item" : "items"}.`}
          </Text>
        </View>
      </StepCard>
    </View>
  );
}
