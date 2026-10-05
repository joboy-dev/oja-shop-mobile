import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets, type Edge } from "react-native-safe-area-context";
import { cn } from "@/utils/cn";

/**
 * Safe-area-aware screen background. Tab screens own the top inset (no native header); stacked screens
 * with a native header pass edges={[]} because the header already clears the notch.
 * Uses the insets hook + a plain View, so it doesn't depend on `className` support for SafeAreaView.
 */
export function Screen({
  children,
  edges = ["top"],
  className,
}: {
  children: ReactNode;
  edges?: Edge[];
  className?: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn("flex-1 bg-background", className)}
      style={{
        paddingTop: edges.includes("top") ? insets.top : 0,
        paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
        paddingLeft: edges.includes("left") ? insets.left : 0,
        paddingRight: edges.includes("right") ? insets.right : 0,
      }}
    >
      {children}
    </View>
  );
}
