import { ChevronDown } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from "react-native-reanimated";
import { duration, ease } from "@/theme/motion";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

function Row({ item, open, onToggle }: { item: AccordionItem; open: boolean; onToggle: () => void }) {
  const reduceMotion = useReducedMotion();
  const chevron = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(open ? "180deg" : "0deg", {
          duration: reduceMotion ? 0 : duration.base,
          easing: ease.snap,
        }),
      },
    ],
  }));

  return (
    <Animated.View layout={reduceMotion ? undefined : LinearTransition.duration(duration.base)}>
      <View className="border-b border-border">
        <PressableScale
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={item.title}
          scaleTo={0.99}
          onPress={onToggle}
          className="min-h-14 flex-row items-center justify-between gap-4 py-3"
        >
          <Text variant="label" className="flex-1 text-[16px] leading-[21px]">
            {item.title}
          </Text>
          <Animated.View style={chevron}>
            <Icon as={ChevronDown} size={20} tone="fg-muted" />
          </Animated.View>
        </PressableScale>
        {open && (
          <Animated.View entering={FadeIn.duration(duration.base)} exiting={FadeOut.duration(duration.fast)}>
            <View className="pb-4">{item.content}</View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

/** One open at a time, animated open/close (web: Accordion). */
export function Accordion({
  items,
  defaultOpenId,
}: {
  items: readonly AccordionItem[];
  defaultOpenId?: string;
}) {
  const [openId, setOpenId] = useState<string | undefined>(defaultOpenId);
  return (
    <View className="border-t border-border">
      {items.map((item) => (
        <Row
          key={item.id}
          item={item}
          open={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? undefined : item.id)}
        />
      ))}
    </View>
  );
}
