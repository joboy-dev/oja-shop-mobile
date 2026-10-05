import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { PageHeading, Prose, infoPages } from "@/features/content";
import { ErrorState } from "@/components/ui/ErrorState";

/** Shipping & returns, Privacy and Terms: plain long-form pages sharing one layout. */
export default function InfoPageScreen() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const content = infoPages[page];
  if (!content) return <ErrorState title="Page not found" error={undefined} />;
  return (
    <>
      <Stack.Screen options={{ title: content.title }} />
      <ScrollView contentContainerClassName="gap-4 px-4 pb-12 pt-4" showsVerticalScrollIndicator={false}>
        <PageHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
        <Prose blocks={content.blocks} />
      </ScrollView>
    </>
  );
}
