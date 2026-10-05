import { ArrowRight } from "lucide-react-native";
import { View } from "react-native";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { Text } from "@/components/ui/Text";

/** Full-bleed indigo band about the makers (web: StoryBand). */
export function StoryBand({ imageUrl }: { imageUrl: string | null }) {
  return (
    <View className="my-10 overflow-hidden bg-primary px-4 py-14">
      <View className="absolute inset-0">
        <AdirePattern color="#ffffff" opacity={0.1} />
      </View>
      <Text variant="eyebrow" tone="on-primary" className="opacity-70">
        Our makers
      </Text>
      <Text variant="h1" tone="on-primary" className="mt-3">
        Every piece has a name behind it.
      </Text>
      <Text variant="bodyLg" tone="on-primary" className="mt-5 opacity-85">
        We work with dyers in Abeokuta, potters in Ibadan and basket weavers in Kano. They set their own
        prices, make in batches small enough to do properly, and we photograph every piece ourselves so what
        arrives looks like what you ordered.
      </Text>
      <Button
        variant="accent"
        size="lg"
        className="mt-7"
        href="/info/about"
        endIcon={<Icon as={ArrowRight} size={20} tone="on-accent" />}
      >
        Read our story
      </Button>
      <View className="mt-9 aspect-[5/4] w-full overflow-hidden rounded-sheet bg-surface-2">
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            alt="Hand-dyed indigo cloth with pale circular motifs"
            className="h-full w-full"
          />
        )}
      </View>
    </View>
  );
}
