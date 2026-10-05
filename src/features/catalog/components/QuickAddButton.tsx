import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { toast } from "sonner-native";
import { IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/features/cart";
import type { ProductSummary } from "@/lib/types/catalog";
import { cn } from "@/utils/cn";
import { toAddable } from "./product-utils";

/** One-tap add from a grid card. */
export function QuickAddButton({ product, className }: { product: ProductSummary; className?: string }) {
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  return (
    <IconButton
      label={`Add ${product.name} to bag`}
      variant="primary"
      haptic="light"
      className={cn("h-10 w-10 rounded-full", className)}
      onPress={async () => {
        if (await add(toAddable(product)))
          toast.success(`${product.name} added`, {
            action: { label: "View bag", onClick: () => router.navigate("/bag") },
          });
      }}
    >
      <Icon as={Plus} size={20} tone="on-primary" strokeWidth={2.5} />
    </IconButton>
  );
}
