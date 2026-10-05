import { useRouter } from "expo-router";
import { Search as SearchIcon, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { PressableScale } from "@/components/ui/PressableScale";
import { Price } from "@/components/ui/Price";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import { useProductSearch } from "@/features/catalog";
import { useRecentSearches } from "@/features/search";
import { useDebounce } from "@/hooks/useDebounce";
import { withAlpha } from "@/theme/colors";
import { useTheme } from "@/theme/ThemeProvider";

/** Full-screen search: results as you type (debounced), recent searches, Enter opens the full list in Shop. */
export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const input = useRef<TextInput>(null);
  const [text, setText] = useState("");
  const query = useDebounce(text.trim(), 300);
  const search = useProductSearch(query);
  const recents = useRecentSearches();

  const openResults = (term: string) => {
    recents.add(term);
    router.replace({ pathname: "/shop", params: { q: term } });
  };

  const typed = text.trim().length >= 2;

  // Focus once the screen transition has finished. `autoFocus` raises the keyboard mid-animation, which is
  // a known way to upset native screens on some devices.
  useEffect(() => {
    const id = setTimeout(() => input.current?.focus(), 350);
    return () => clearTimeout(id);
  }, []);

  return (
    <Screen>
      <View className="flex-row items-center gap-2 px-4 py-2">
        <View className="h-11 flex-1 flex-row items-center gap-2.5 rounded-control border border-primary bg-surface px-3.5">
          <Icon as={SearchIcon} size={18} tone="fg-muted" />
          <TextInput
            ref={input}
            value={text}
            onChangeText={setText}
            returnKeyType="search"
            onSubmitEditing={() => typed && openResults(text.trim())}
            placeholder="Search baskets, adire, candles…"
            placeholderTextColor={withAlpha(colors["fg-muted"], 0.7)}
            selectionColor={colors.primary}
            accessibilityLabel="Search products"
            autoCorrect={false}
            className="h-full flex-1 py-0 font-sans text-[16px] text-fg"
          />
          {text.length > 0 && (
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={10}
              onPress={() => {
                setText("");
                input.current?.focus();
              }}
            >
              <Icon as={X} size={18} tone="fg-muted" />
            </PressableScale>
          )}
        </View>
        <Button variant="ghost" onPress={() => router.back()}>
          Cancel
        </Button>
      </View>

      {!typed ? (
        <View className="px-4 pt-4">
          {recents.terms.length > 0 ? (
            <>
              <View className="mb-2 flex-row items-center justify-between">
                <Text variant="eyebrow" tone="muted">
                  Recent
                </Text>
                <Button variant="ghost" size="sm" onPress={recents.clear} className="-mr-3">
                  Clear
                </Button>
              </View>
              {recents.terms.map((term) => (
                <PressableScale
                  key={term}
                  accessibilityRole="button"
                  scaleTo={0.99}
                  onPress={() => openResults(term)}
                  className="min-h-12 flex-row items-center gap-3"
                >
                  <Icon as={SearchIcon} size={16} tone="fg-muted" />
                  <Text>{term}</Text>
                </PressableScale>
              ))}
            </>
          ) : (
            <Text tone="muted">Try “basket”, “adire”, “candle” or “shea”.</Text>
          )}
        </View>
      ) : search.isPending ? (
        <View className="gap-4 px-4 pt-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-control" />
          ))}
        </View>
      ) : (
        <FlatList
          data={search.data ?? []}
          keyExtractor={(p) => p.id}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-4 pb-8"
          ListEmptyComponent={
            <View className="items-center pt-10">
              <Text variant="h3">
                {search.isError ? "Search isn't available" : `No results for “${text.trim()}”`}
              </Text>
              <Text tone="muted" className="mt-2 text-center">
                {search.isError
                  ? "Check your connection and try again."
                  : "Check the spelling or try something broader."}
              </Text>
            </View>
          }
          ListFooterComponent={
            (search.data?.length ?? 0) > 0 ? (
              <Button
                variant="outline"
                className="mt-4"
                fullWidth
                onPress={() => openResults(text.trim())}
              >{`See all results for “${text.trim()}”`}</Button>
            ) : null
          }
          renderItem={({ item }) => (
            <PressableScale
              accessibilityRole="link"
              accessibilityLabel={item.name}
              scaleTo={0.99}
              onPress={() => {
                recents.add(text);
                router.replace({ pathname: "/product/[slug]", params: { slug: item.slug } });
              }}
              className="flex-row items-center gap-3.5 py-2.5"
            >
              <View className="h-16 w-14 overflow-hidden rounded-control bg-surface-2">
                {item.image && <Image source={{ uri: item.image.url }} className="h-full w-full" />}
              </View>
              <View className="flex-1 gap-0.5">
                <Text variant="eyebrow" tone="muted">
                  {item.category.name}
                </Text>
                <Text variant="label" className="text-[16px] leading-[21px]" numberOfLines={2}>
                  {item.name}
                </Text>
              </View>
              <Price kobo={item.price} size="sm" />
            </PressableScale>
          )}
        />
      )}
    </Screen>
  );
}

/**
 * If anything in this screen throws, show the message on screen (instead of the app closing) with a way back.
 * Expo Router renders this in place of the screen.
 */
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const router = useRouter();
  return (
    <Screen>
      <View className="flex-1 justify-center gap-4 px-6">
        <Text variant="h2">Search hit a problem</Text>
        <Text tone="muted" selectable>
          {error.message}
        </Text>
        <Button onPress={retry}>Try again</Button>
        <Button variant="outline" onPress={() => router.back()}>
          Go back
        </Button>
      </View>
    </Screen>
  );
}
