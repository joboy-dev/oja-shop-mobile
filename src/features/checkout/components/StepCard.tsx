import { Check } from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition, useReducedMotion } from "react-native-reanimated";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { duration } from "@/theme/motion";
import { cn } from "@/utils/cn";

export type StepState = "active" | "done" | "upcoming";

/** One numbered checkout step: open while active, a one-line editable summary once done (web: StepCard). */
export function StepCard({
  index,
  title,
  state,
  summary,
  onEdit,
  children,
}: {
  index: number;
  title: string;
  state: StepState;
  summary?: ReactNode;
  onEdit?: () => void;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View layout={reduceMotion ? undefined : LinearTransition.duration(duration.slow)}>
      <View
        accessibilityState={{ expanded: state === "active" }}
        className={cn(
          "rounded-sheet border bg-surface p-5",
          state === "active" ? "border-primary" : "border-border",
          state === "upcoming" && "opacity-60",
        )}
      >
        <View className="flex-row items-center gap-3">
          <View
            className={cn(
              "h-8 w-8 items-center justify-center rounded-full",
              state === "done" ? "bg-success" : state === "active" ? "bg-primary" : "bg-surface-2",
            )}
          >
            {state === "done" ? (
              <Icon as={Check} size={16} color="#ffffff" strokeWidth={3} />
            ) : (
              <Text
                variant="mono"
                className={cn("font-mono-medium", state === "active" ? "text-on-primary" : "text-fg-muted")}
              >
                {String(index)}
              </Text>
            )}
          </View>
          <Text variant="h3" className="flex-1">
            {title}
          </Text>
          {state === "done" && onEdit && (
            <Button variant="ghost" size="sm" onPress={onEdit} accessibilityLabel={`Edit ${title}`}>
              Edit
            </Button>
          )}
        </View>
        {state === "done" && summary && (
          <Animated.View entering={FadeIn.duration(duration.base)}>
            <View className="mt-3 pl-11">
              <Text variant="bodySm" tone="muted">
                {summary}
              </Text>
            </View>
          </Animated.View>
        )}
        {state === "active" && (
          <Animated.View
            entering={FadeIn.duration(duration.slow).delay(80)}
            exiting={FadeOut.duration(duration.fast)}
          >
            <View className="mt-5">{children}</View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}
