import { ArrowRight } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { Reveal } from "@/components/ui/Reveal";
import { Text } from "@/components/ui/Text";
import { PageHeading, aboutImage, aboutStory, aboutValues } from "@/features/content";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerClassName="gap-8 px-4 pb-10 pt-4" showsVerticalScrollIndicator={false}>
      <PageHeading
        eyebrow="About Ọjà"
        title="A market, made small."
        intro="Ọjà means market in Yoruba. We started with one question: why is it still so hard to buy beautiful, well-made things from the people who make them?"
      />

      <View className="aspect-[16/10] overflow-hidden rounded-sheet bg-surface-2">
        <Image
          source={{ uri: aboutImage }}
          alt="Indigo-dyed cloths hanging to dry between buildings"
          className="h-full w-full"
        />
      </View>

      <View className="gap-4">
        <Text variant="h2">Where it comes from</Text>
        {aboutStory.map((p) => (
          <Text key={p} variant="prose" tone="muted">
            {p}
          </Text>
        ))}
      </View>

      <View className="gap-4">
        {aboutValues.map((v, i) => (
          <Reveal key={v.title} index={i} className="gap-2 rounded-card border border-border bg-surface p-5">
            <Text variant="h3">{v.title}</Text>
            <Text tone="muted">{v.text}</Text>
          </Reveal>
        ))}
      </View>

      <View className="items-center overflow-hidden rounded-sheet bg-primary px-6 py-12">
        <View className="absolute inset-0">
          <AdirePattern color="#ffffff" opacity={0.12} />
        </View>
        <Text variant="h2" tone="on-primary" className="text-center">
          See what&apos;s new
        </Text>
        <Text tone="on-primary" className="mt-3 text-center opacity-85">
          Every piece in the shop has a maker behind it.
        </Text>
        <Button
          variant="accent"
          size="lg"
          className="mt-7"
          href="/shop"
          endIcon={<Icon as={ArrowRight} size={20} tone="on-accent" />}
        >
          Shop the collection
        </Button>
      </View>
    </ScrollView>
  );
}
