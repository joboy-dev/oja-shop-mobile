import { useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { ShopView } from "@/features/catalog";

export default function ShopScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  return (
    <Screen>
      <ShopView key={q ?? ""} initialQuery={q} />
    </Screen>
  );
}
