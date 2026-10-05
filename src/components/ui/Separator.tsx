import { View } from "react-native";
import { cn } from "@/utils/cn";

export function Separator({ className }: { className?: string }) {
  return <View accessibilityRole="none" className={cn("h-px bg-border", className)} />;
}
