import { Check, ShoppingBag } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCartStore, type AddableProduct } from "@/features/cart";
import { haptic } from "@/utils/haptics";

/** Label morphs to "Added" with a check for a moment, plus a haptic and the tab-bar badge bump. */
export function AddToBagButton({
  product,
  quantity,
  className,
}: {
  product: AddableProduct;
  quantity: number;
  className?: string;
}) {
  const add = useCartStore((s) => s.add);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(id);
  }, [added]);

  return (
    <Button
      size="lg"
      variant={added ? "secondary" : "primary"}
      disabled={soldOut}
      className={className}
      startIcon={
        <Icon
          as={added ? Check : ShoppingBag}
          size={18}
          tone={added ? "success" : "on-primary"}
          strokeWidth={added ? 3 : 2}
        />
      }
      onPress={async () => {
        if (await add(product, quantity)) {
          haptic("success");
          setAdded(true);
        }
      }}
    >
      {soldOut ? "Sold out" : added ? "Added" : "Add to bag"}
    </Button>
  );
}
