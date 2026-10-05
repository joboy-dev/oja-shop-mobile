import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { orderStatusLabels, type OrderStatus } from "@/lib/config/shop";

const tone: Record<OrderStatus, BadgeTone> = {
  pending: "neutral",
  confirmed: "primary",
  processing: "primary",
  shipped: "accent",
  delivered: "success",
  cancelled: "danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={tone[status]}>{orderStatusLabels[status]}</Badge>;
}
