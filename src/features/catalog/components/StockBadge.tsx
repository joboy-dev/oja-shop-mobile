import { Badge } from "@/components/ui/Badge";
import { shopConfig } from "@/lib/config/shop";

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge tone="danger">Sold out</Badge>;
  if (stock <= shopConfig.lowStockThreshold) return <Badge tone="accent">{`Only ${stock} left`}</Badge>;
  return <Badge tone="success">In stock</Badge>;
}
