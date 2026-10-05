import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ShopView } from "@/features/catalog";

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  return (
    <Screen>
      <View className="px-2">
        <IconButton
          label="Back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/shop"))}
        >
          <Icon as={ChevronLeft} size={24} />
        </IconButton>
      </View>
      <ShopView key={category} categorySlug={category} />
    </Screen>
  );
}
