import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import { forwardRef, useCallback, type ReactNode } from "react";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, useThemeVars } from "@/theme/ThemeProvider";
import { radius } from "@/theme/tokens";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

export type SheetRef = BottomSheetModal;

interface SheetProps {
  title?: string;
  children: ReactNode;
  /** Use when the content can be taller than the screen (filters, long lists). */
  scrollable?: boolean;
  onDismiss?: () => void;
}

/**
 * Bottom sheet (web: Vaul). Open with `ref.current?.present()`, close with `dismiss()`.
 * Sheets are portalled outside the app's root view, so the theme variables are re-applied here.
 */
export const Sheet = forwardRef<SheetRef, SheetProps>(function Sheet(
  { title, children, scrollable, onDismiss },
  ref,
) {
  const { colors } = useTheme();
  const themeVars = useThemeVars();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const backdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const Body = scrollable ? BottomSheetScrollView : BottomSheetView;

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      maxDynamicContentSize={height * 0.88}
      backdropComponent={backdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      topInset={insets.top}
      onDismiss={onDismiss}
      handleIndicatorStyle={{ backgroundColor: colors["border-strong"], width: 40 }}
      backgroundStyle={{
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.sheet,
        borderTopRightRadius: radius.sheet,
      }}
    >
      <Body
        style={themeVars}
        contentContainerStyle={scrollable ? { paddingBottom: insets.bottom + 16 } : undefined}
      >
        <View style={scrollable ? undefined : { paddingBottom: insets.bottom + 16 }}>
          {title && (
            <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
              <Text variant="h3">{title}</Text>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                onPress={() => (ref as React.RefObject<SheetRef | null>)?.current?.dismiss()}
                className="h-9 w-9 items-center justify-center rounded-full bg-surface-2"
              >
                <Icon as={X} size={18} />
              </PressableScale>
            </View>
          )}
          {children}
        </View>
      </Body>
    </BottomSheetModal>
  );
});
