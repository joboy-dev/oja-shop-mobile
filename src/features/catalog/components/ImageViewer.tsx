import { X } from "lucide-react-native";
import { useRef, useState } from "react";
import { FlatList, Modal, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import type { ProductImageDTO } from "@/lib/types/catalog";
import { ZoomableImage } from "./ZoomableImage";

/** Full-screen photo viewer with pinch-to-zoom and swipe between photos. */
export function ImageViewer({
  images,
  initialIndex,
  visible,
  onClose,
}: {
  images: ProductImageDTO[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(initialIndex);
  const list = useRef<FlatList>(null);

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000000" }}>
        <FlatList
          ref={list}
          horizontal
          pagingEnabled
          data={images}
          keyExtractor={(i) => i.id}
          initialScrollIndex={initialIndex}
          getItemLayout={(_d, i) => ({ length: width, offset: width * i, index: i })}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item }) => <ZoomableImage uri={item.url} alt={item.alt} />}
        />
        <View className="absolute right-3 flex-row items-center gap-3" style={{ top: insets.top + 8 }}>
          <Text variant="mono" tone="white" className="opacity-80">{`${index + 1} / ${images.length}`}</Text>
          <IconButton label="Close photo viewer" variant="surface" className="rounded-full" onPress={onClose}>
            <Icon as={X} size={20} />
          </IconButton>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
