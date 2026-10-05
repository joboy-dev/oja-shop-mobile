import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Image } from "@/components/ui/Image";

const MAX_SCALE = 4;

/**
 * Pinch to zoom, drag to look around when zoomed, double-tap to toggle. All on the UI thread via
 * Reanimated worklets. Dragging only activates while zoomed so a paging list around it can still swipe.
 */
export function ZoomableImage({ uri, alt }: { uri: string; alt: string }) {
  const { width, height } = useWindowDimensions();
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const reset = () => {
    "worklet";
    scale.value = withTiming(1);
    savedScale.value = 1;
    x.value = withTiming(0);
    y.value = withTiming(0);
    savedX.value = 0;
    savedY.value = 0;
  };

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 1), MAX_SCALE);
    })
    .onEnd(() => {
      if (scale.value < 1.05) reset();
      else savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_e, state) => {
      if (scale.value > 1) state.activate();
      else state.fail();
    })
    .onUpdate((e) => {
      x.value = savedX.value + e.translationX;
      y.value = savedY.value + e.translationY;
    })
    .onEnd(() => {
      savedX.value = x.value;
      savedY.value = y.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) reset();
      else {
        scale.value = withTiming(2.5);
        savedScale.value = 2.5;
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={Gesture.Exclusive(doubleTap, Gesture.Simultaneous(pinch, pan))}>
      <Animated.View style={[{ width, height, alignItems: "center", justifyContent: "center" }, style]}>
        <Image source={{ uri }} alt={alt} contentFit="contain" className="h-full w-full" />
      </Animated.View>
    </GestureDetector>
  );
}
