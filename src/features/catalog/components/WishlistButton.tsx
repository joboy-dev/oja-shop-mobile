import { Heart } from "lucide-react-native";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import { IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useSessionUser } from "@/features/auth";
import { useToggleWishlist, useWishlistIds } from "@/features/wishlist";
import { useTheme } from "@/theme/ThemeProvider";
import { cn } from "@/utils/cn";

/** Heart in a round chip (web: WishlistButton). Signed-out shoppers are invited to sign in instead. */
export function WishlistButton({
  productId,
  productName,
  className,
}: {
  productId: string;
  productName: string;
  className?: string;
}) {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useSessionUser();
  const { data: ids } = useWishlistIds();
  const toggle = useToggleWishlist();
  const wished = !!ids?.includes(productId);

  return (
    <IconButton
      label={wished ? `Remove ${productName} from favourites` : `Save ${productName} to favourites`}
      variant="surface"
      accessibilityState={{ selected: wished }}
      className={cn("h-10 w-10 rounded-full", className)}
      onPress={() => {
        if (!isAuthenticated) {
          toast("Sign in to save favourites", {
            action: {
              label: "Sign in",
              onClick: () => router.push({ pathname: "/login", params: { next: "/wishlist" } }),
            },
          });
          return;
        }
        toggle.mutate({ productId, name: productName });
      }}
    >
      <Icon as={Heart} size={19} tone={wished ? "primary" : "fg"} fill={wished ? colors.primary : "none"} />
    </IconButton>
  );
}
