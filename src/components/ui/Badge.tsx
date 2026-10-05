import { View } from "react-native";
import { cn } from "@/utils/cn";
import { Text } from "./Text";

const tones = {
  neutral: { box: "bg-surface-2", text: "text-fg" },
  primary: { box: "bg-primary-soft", text: "text-primary" },
  accent: { box: "bg-accent", text: "text-on-accent" },
  success: { box: "bg-success-soft", text: "text-success" },
  danger: { box: "bg-danger-soft", text: "text-danger" },
  outline: { box: "border border-border-strong", text: "text-fg-muted" },
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: string;
}) {
  return (
    <View
      className={cn(
        "flex-row items-center self-start rounded-full px-2.5 py-0.5",
        tones[tone].box,
        className,
      )}
    >
      <Text variant="badge" className={tones[tone].text}>
        {children}
      </Text>
    </View>
  );
}
