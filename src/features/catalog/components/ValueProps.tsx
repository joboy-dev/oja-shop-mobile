import { Hand, RotateCcw, ShieldCheck, Truck } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Text } from "@/components/ui/Text";

const props = [
  {
    icon: Truck,
    title: "Delivery across Nigeria",
    text: "1–2 days in Lagos, 3–5 elsewhere. Express available.",
  },
  { icon: RotateCcw, title: "7-day returns", text: "Not right? Send it back unused and we'll sort it." },
  {
    icon: ShieldCheck,
    title: "Pay when it arrives",
    text: "Choose pay on delivery, or transfer once you're ready.",
  },
  {
    icon: Hand,
    title: "Made in small batches",
    text: "Every piece is finished by hand, so no two are identical.",
  },
] as const;

export function ValueProps() {
  return (
    <View className="gap-7 px-4 py-8" accessibilityLabel="Why shop with us">
      {props.map(({ icon, title, text }, i) => (
        <Reveal key={title} index={i} className="flex-row gap-4">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
            <Icon as={icon} size={20} tone="primary" />
          </View>
          <View className="flex-1">
            <Text variant="h3" className="text-[17px] leading-[22px]">
              {title}
            </Text>
            <Text variant="bodySm" tone="muted" className="mt-1">
              {text}
            </Text>
          </View>
        </Reveal>
      ))}
    </View>
  );
}
