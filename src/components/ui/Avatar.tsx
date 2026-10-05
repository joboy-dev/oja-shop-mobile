import { View } from "react-native";
import { cn } from "@/utils/cn";
import { Image } from "./Image";
import { Text } from "./Text";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export function Avatar({
  name,
  imageUrl,
  size = 48,
  className,
}: {
  name: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    <View
      accessibilityElementsHidden
      className={cn("items-center justify-center overflow-hidden rounded-full bg-primary-soft", className)}
      style={{ width: size, height: size }}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className="h-full w-full" />
      ) : (
        <Text variant="label" tone="primary" style={{ fontSize: size * 0.38 }}>
          {initials(name) || "?"}
        </Text>
      )}
    </View>
  );
}
