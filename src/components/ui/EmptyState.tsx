import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { Text } from "./Text";

/** Dashed panel with the faint adire pattern: says what's missing and offers a next step (web: EmptyState). */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "items-center overflow-hidden rounded-sheet border border-dashed border-border-strong px-6 py-14",
        className,
      )}
    >
      <View className="absolute inset-0">
        <AdirePattern opacity={0.05} />
      </View>
      {icon && (
        <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-primary-soft">
          <Icon as={icon} size={24} tone="primary" />
        </View>
      )}
      <Text variant="h3" className="text-center">
        {title}
      </Text>
      {description && (
        <Text tone="muted" className="mt-2 max-w-[320px] text-center">
          {description}
        </Text>
      )}
      {action && <View className="mt-6">{action}</View>}
    </View>
  );
}
