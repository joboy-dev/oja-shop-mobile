import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { RefreshControl, ScrollView, View } from "react-native";
import { Logo } from "@/components/brand/Logo";
import { Screen } from "@/components/layout/Screen";
import { IconButton } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  CategoryRail,
  Hero,
  ProductShelf,
  SectionHeader,
  StoryBand,
  ValueProps,
  useHome,
} from "@/features/catalog";
import { NewsletterBand } from "@/features/content";
import { useTheme } from "@/theme/ThemeProvider";

function HomeSkeleton() {
  return (
    <View className="gap-4 px-4 pt-6">
      <Skeleton className="h-3 w-32 rounded" />
      <Skeleton className="h-12 w-full rounded-control" />
      <Skeleton className="h-12 w-3/4 rounded-control" />
      <Skeleton className="mt-4 aspect-[4/5] w-full rounded-sheet" />
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data, isPending, isError, error, refetch, isRefetching } = useHome();

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-4 py-2">
        <Logo />
        <IconButton label="Search products" onPress={() => router.push("/search")}>
          <Icon as={Search} size={22} />
        </IconButton>
      </View>

      {isPending ? (
        <HomeSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => void refetch()}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <Hero images={data.heroImages} />
          <Reveal className="pb-6">
            <SectionHeader
              eyebrow="Browse"
              title="Shop by category"
              href="/shop"
              hrefLabel="View everything"
            />
            <CategoryRail categories={data.categories} />
          </Reveal>
          <View className="py-6">
            <SectionHeader eyebrow="Just in" title="New arrivals" href="/shop" />
            <ProductShelf products={data.newest} />
          </View>
          <StoryBand imageUrl={data.storyImageUrl} />
          <View className="py-6">
            <SectionHeader
              eyebrow="Loved by customers"
              title="Best sellers"
              href="/shop"
              hrefLabel="Shop all"
            />
            <ProductShelf products={data.featured} />
          </View>
          <ValueProps />
          <NewsletterBand />
        </ScrollView>
      )}
    </Screen>
  );
}
