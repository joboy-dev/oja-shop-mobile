import { Check, X } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { orderStatusLabels, type OrderStatus } from "@/lib/config/shop";
import type { OrderEventDTO } from "@/lib/types/order";
import { cn } from "@/utils/cn";
import { formatDateTime } from "@/utils/date";

const flow: OrderStatus[] = ["confirmed", "processing", "shipped", "delivered"];

/** Where the order is now, with the time each step happened (web: OrderStatusTimeline). */
export function OrderStatusTimeline({ status, events }: { status: OrderStatus; events: OrderEventDTO[] }) {
  const at = new Map<OrderStatus, OrderEventDTO>();
  for (const e of events) if (!at.has(e.status)) at.set(e.status, e);

  if (status === "cancelled") {
    const e = at.get("cancelled");
    return (
      <View className="flex-row items-start gap-3 rounded-card bg-danger-soft p-4">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-danger">
          <Icon as={X} size={16} color="#ffffff" />
        </View>
        <View className="flex-1">
          <Text variant="label" tone="danger">
            Order cancelled
          </Text>
          {e && (
            <Text variant="caption" tone="muted">
              {formatDateTime(e.createdAt)}
            </Text>
          )}
          {e?.note && (
            <Text variant="bodySm" className="mt-1">
              {e.note}
            </Text>
          )}
        </View>
      </View>
    );
  }

  const currentIndex = flow.indexOf(status === "pending" ? "confirmed" : status);
  return (
    <View accessibilityRole="list">
      {flow.map((s, i) => {
        const reached = i <= currentIndex;
        const current = i === currentIndex;
        const event = at.get(s);
        const last = i === flow.length - 1;
        return (
          <View
            key={s}
            accessibilityLabel={`${orderStatusLabels[s]}${current ? ", current step" : reached ? ", done" : ", not yet"}`}
            accessible
            className="flex-row gap-4"
          >
            <View className="items-center">
              <View
                className={cn(
                  "h-7 w-7 items-center justify-center rounded-full border-2",
                  reached ? "border-primary bg-primary" : "border-border-strong bg-surface",
                  current && "border-[3px]",
                )}
              >
                {reached && <Icon as={Check} size={14} tone="on-primary" strokeWidth={3} />}
              </View>
              {!last && (
                <View className={cn("w-0.5 flex-1", i < currentIndex ? "bg-primary" : "bg-border")} />
              )}
            </View>
            <View className={cn("flex-1", !last && "pb-5")}>
              <Text variant="label" className={cn("text-[16px] leading-[21px]", !reached && "text-fg-muted")}>
                {orderStatusLabels[s]}
              </Text>
              {event ? (
                <Text variant="caption" tone="muted">
                  {formatDateTime(event.createdAt)}
                  {event.note && event.note !== "Order placed" ? ` · ${event.note}` : ""}
                </Text>
              ) : (
                !reached && (
                  <Text variant="caption" tone="muted" className="opacity-70">
                    Not yet
                  </Text>
                )
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
