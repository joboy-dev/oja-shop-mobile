import { useRouter, type Href } from "expo-router";
import {
  ChevronRight,
  CircleHelp,
  Info,
  LogOut,
  MapPin,
  Package,
  Truck,
  FileText,
  Shield,
  Mail,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { RefreshControl, ScrollView, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PressableScale } from "@/components/ui/PressableScale";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import { GoogleSignInButton, signOutUser, useSessionUser } from "@/features/auth";
import { OrderCard, useOrders } from "@/features/orders";
import { useAddresses } from "@/features/addresses";
import { useTheme } from "@/theme/ThemeProvider";
import type { ThemePreference } from "@/theme/theme.store";
import { toast } from "sonner-native";

function Row({
  icon,
  label,
  href,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  href: Href;
  detail?: string;
}) {
  const router = useRouter();
  return (
    <PressableScale
      accessibilityRole="link"
      accessibilityLabel={label}
      scaleTo={0.99}
      onPress={() => router.push(href)}
      className="min-h-14 flex-row items-center gap-3.5 px-4"
    >
      <Icon as={icon} size={20} tone="primary" />
      <Text variant="label" className="flex-1 text-[16px]">
        {label}
      </Text>
      {detail && (
        <Text variant="caption" tone="muted">
          {detail}
        </Text>
      )}
      <Icon as={ChevronRight} size={18} tone="fg-muted" />
    </PressableScale>
  );
}

const themeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

export default function AccountScreen() {
  const { colors, preference, setPreference } = useTheme();
  const { user, isAuthenticated, isPending } = useSessionUser();
  const orders = useOrders();
  const addresses = useAddresses();
  const defaultAddress = addresses.data?.find((a) => a.isDefault) ?? addresses.data?.[0];

  const refresh = () => {
    void orders.refetch();
    void addresses.refetch();
  };

  const help = (
    <View className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
      <Row icon={CircleHelp} label="FAQ" href="/info/faq" />
      <View className="h-px bg-border" />
      <Row icon={Truck} label="Shipping & returns" href="/info/shipping-returns" />
      <View className="h-px bg-border" />
      <Row icon={Mail} label="Contact us" href="/info/contact" />
      <View className="h-px bg-border" />
      <Row icon={Info} label="About Ọjà" href="/info/about" />
      <View className="h-px bg-border" />
      <Row icon={Shield} label="Privacy policy" href="/info/privacy" />
      <View className="h-px bg-border" />
      <Row icon={FileText} label="Terms of service" href="/info/terms" />
    </View>
  );

  const appearance = (
    <View className="mt-6 gap-3 rounded-card border border-border bg-surface p-4">
      <Text variant="label">Appearance</Text>
      <SegmentedTabs options={themeOptions} value={preference as ThemePreference} onChange={setPreference} />
    </View>
  );

  return (
    <Screen>
      <ScrollView
        contentContainerClassName="px-4 pb-10 pt-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          isAuthenticated ? (
            <RefreshControl refreshing={false} onRefresh={refresh} tintColor={colors.primary} />
          ) : undefined
        }
      >
        <Text variant="h1" className="mb-5">
          Account
        </Text>

        {isPending ? (
          <Skeleton className="h-24 w-full rounded-card" />
        ) : !isAuthenticated || !user ? (
          <View className="gap-4 rounded-sheet border border-border bg-surface p-6">
            <Text variant="h3">Sign in to Ọjà</Text>
            <Text tone="muted">
              Track orders, save addresses and keep a wishlist across your phone and the website.
            </Text>
            <GoogleSignInButton />
          </View>
        ) : (
          <>
            <View className="flex-row items-center gap-4 rounded-sheet border border-border bg-surface p-5">
              <Avatar name={user.name} imageUrl={user.image} size={56} />
              <View className="flex-1">
                <Text variant="h3" numberOfLines={1}>{`Hello, ${user.name.split(" ")[0]}`}</Text>
                <Text variant="caption" tone="muted" numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
            </View>

            <View className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
              <Row
                icon={Package}
                label="Orders"
                href="/account/orders"
                detail={orders.data ? String(orders.data.length) : undefined}
              />
              <View className="h-px bg-border" />
              <Row
                icon={MapPin}
                label="Addresses"
                href="/account/addresses"
                detail={addresses.data ? String(addresses.data.length) : undefined}
              />
            </View>

            <View className="mt-8 gap-3">
              <View className="flex-row items-center justify-between">
                <Text variant="h3">Recent orders</Text>
                {(orders.data?.length ?? 0) > 3 && (
                  <Button variant="ghost" size="sm" href="/account/orders" className="-mr-3">
                    View all
                  </Button>
                )}
              </View>
              {orders.isPending ? (
                <Skeleton className="h-28 w-full rounded-card" />
              ) : (orders.data?.length ?? 0) === 0 ? (
                <View className="items-start gap-3 rounded-card border border-dashed border-border-strong p-5">
                  <Text tone="muted">You haven&apos;t placed an order yet.</Text>
                  <Button variant="outline" href="/shop">
                    Start shopping
                  </Button>
                </View>
              ) : (
                orders.data!.slice(0, 3).map((o) => <OrderCard key={o.id} order={o} />)
              )}
            </View>

            {defaultAddress && (
              <View className="mt-8 gap-2 rounded-card border border-border bg-surface p-4">
                <Text variant="eyebrow" tone="muted">
                  Default address
                </Text>
                <Text variant="label" className="text-[16px]">
                  {defaultAddress.fullName}
                </Text>
                <Text
                  variant="bodySm"
                  tone="muted"
                >{`${defaultAddress.line1}, ${defaultAddress.city}, ${defaultAddress.state}`}</Text>
              </View>
            )}
          </>
        )}

        {appearance}
        {help}

        {isAuthenticated && (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            className="mt-6"
            startIcon={<Icon as={LogOut} size={18} />}
            onPress={async () => {
              await signOutUser();
              toast("Signed out");
            }}
          >
            Sign out
          </Button>
        )}
      </ScrollView>
    </Screen>
  );
}
