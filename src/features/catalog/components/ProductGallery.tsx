import { ImageOff } from "lucide-react-native";
import { useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { PressableScale } from "@/components/ui/PressableScale";
import type { ProductImageDTO } from "@/lib/types/catalog";
import { cn } from "@/utils/cn";
import { ImageViewer } from "./ImageViewer";

/** Swipeable 4:5 gallery with page dots; tap a photo to open the zoomable viewer (web: ProductGallery). */
export function ProductGallery({ images, name }: { images: ProductImageDTO[]; name: string }) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  if (images.length === 0) {
    return (
      <View style={{ width }} className="aspect-[4/5] items-center justify-center bg-surface-2">
        <Icon as={ImageOff} size={32} tone="fg-muted" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        data={images}
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index: i }) => (
          <PressableScale
            accessibilityRole="imagebutton"
            accessibilityLabel={`${name}, photo ${i + 1} of ${images.length}. Double tap to enlarge.`}
            scaleTo={0.995}
            onPress={() => setViewerOpen(true)}
            style={{ width }}
          >
            <View className="aspect-[4/5] bg-surface-2">
              <Image
                source={{ uri: item.url }}
                alt={item.alt}
                className="h-full w-full"
                priority={i === 0 ? "high" : "normal"}
              />
            </View>
          </PressableScale>
        )}
      />
      {images.length > 1 && (
        <View
          className="absolute inset-x-0 bottom-3 flex-row justify-center gap-1.5"
          accessibilityElementsHidden
        >
          {images.map((img, i) => (
            <View
              key={img.id}
              className={cn("h-1.5 rounded-full", i === index ? "w-5 bg-primary" : "w-1.5 bg-fg/30")}
            />
          ))}
        </View>
      )}
      <ImageViewer
        images={images}
        initialIndex={index}
        visible={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </View>
  );
}
