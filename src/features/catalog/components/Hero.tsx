import { ArrowRight } from "lucide-react-native";
import { View } from "react-native";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { Reveal } from "@/components/ui/Reveal";
import { Text } from "@/components/ui/Text";
import { shopConfig } from "@/lib/config/shop";
import type { ProductImageDTO } from "@/lib/types/catalog";
import { formatMoney } from "@/utils/money";

/** Three photos sit in round "resist" cut-outs on indigo cloth, the way pale motifs sit on an adire throw (web: Hero). */
export function Hero({ images }: { images: (ProductImageDTO | null)[] }) {
  const [a, b, c] = images;
  return (
    <View className="px-4 pb-10 pt-6">
      <Reveal index={0}>
        <Text variant="eyebrow" tone="muted">
          Handmade in Lagos
        </Text>
      </Reveal>
      <Reveal index={1}>
        <Text variant="hero" className="mt-4">
          Cloth, clay &amp; cane, made by hand.
        </Text>
      </Reveal>
      <Reveal index={2}>
        <Text variant="bodyLg" tone="muted" className="mt-5">
          Adire throws, stoneware, baskets and candles from independent makers across Nigeria. Small batches,
          honest materials, delivered to your door.
        </Text>
      </Reveal>
      <Reveal index={3} className="mt-7 flex-row flex-wrap gap-3">
        <Button size="lg" href="/shop" endIcon={<Icon as={ArrowRight} size={20} tone="on-primary" />}>
          Shop new arrivals
        </Button>
        <Button size="lg" variant="outline" href="/info/about">
          Meet the makers
        </Button>
      </Reveal>
      <Reveal index={4} className="mt-7 flex-row flex-wrap gap-x-5 gap-y-1.5">
        <Text
          variant="caption"
          tone="muted"
        >{`Free delivery over ${formatMoney(shopConfig.freeShippingThreshold)}`}</Text>
        <Text variant="caption" tone="muted">
          Pay on delivery
        </Text>
        <Text variant="caption" tone="muted">
          7-day returns
        </Text>
      </Reveal>

      <Reveal index={2} className="mt-9">
        <View
          className="aspect-[4/5] w-full overflow-hidden rounded-sheet bg-primary"
          accessibilityElementsHidden
        >
          <View className="absolute inset-0">
            <AdirePattern color="#ffffff" opacity={0.16} />
          </View>
          {a && (
            <View className="absolute -right-[6%] top-[5%] aspect-square w-[70%] overflow-hidden rounded-full border-[8px] border-primary/50 bg-surface-2">
              <Image source={{ uri: a.url }} className="h-full w-full" priority="high" />
            </View>
          )}
          {b && (
            <View className="absolute bottom-[7%] left-[5%] aspect-square w-[50%] overflow-hidden rounded-full border-[8px] border-primary/50 bg-surface-2">
              <Image source={{ uri: b.url }} className="h-full w-full" />
            </View>
          )}
          {c && (
            <View className="absolute bottom-[16%] right-[9%] aspect-square w-[27%] overflow-hidden rounded-full border-4 border-accent bg-surface-2">
              <Image source={{ uri: c.url }} className="h-full w-full" />
            </View>
          )}
        </View>
      </Reveal>
    </View>
  );
}
