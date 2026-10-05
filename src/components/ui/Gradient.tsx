import { LinearGradient, type LinearGradientProps } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

export type GradientProps = Omit<LinearGradientProps, "style"> & { className?: string };

/** expo-linear-gradient filling a plain View that carries the `className` (image scrims, skeleton shimmer). */
export function Gradient({ className, ...props }: GradientProps) {
  return (
    <View className={className} pointerEvents="none">
      <LinearGradient style={StyleSheet.absoluteFill} {...props} />
    </View>
  );
}
