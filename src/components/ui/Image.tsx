import { Image as ExpoImage, type ImageProps as ExpoImageProps } from "expo-image";
import { StyleSheet, View } from "react-native";

export type ImageProps = Omit<ExpoImageProps, "style"> & { className?: string };

/**
 * expo-image inside a plain View.
 *
 * The View carries the `className` (size, radius…) and the image fills it. That way layout never depends
 * on NativeWind being able to map `className` onto a third-party component, and the photo can never render
 * at its natural pixel size (which looks like a giant image covering the screen).
 * Defaults: memory + disk cache, a short cross-fade, `cover` fit.
 */
export function Image({ className, ...props }: ImageProps) {
  return (
    <View className={className}>
      <ExpoImage
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        {...props}
      />
    </View>
  );
}
