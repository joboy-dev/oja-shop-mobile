import { forwardRef, useState, type ReactNode } from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { withAlpha } from "@/theme/colors";
import { useTheme } from "@/theme/ThemeProvider";
import { cn } from "@/utils/cn";

export interface InputProps extends Omit<TextInputProps, "style"> {
  invalid?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  className?: string;
}

/** 44pt text field (web: Input). The border shows focus and error state; the keyboard type is yours to set. */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  { invalid, startAdornment, endAdornment, className, onFocus, onBlur, editable = true, ...props },
  ref,
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      className={cn(
        "h-11 flex-row items-center gap-2 rounded-control border bg-surface px-3.5",
        invalid ? "border-danger" : focused ? "border-primary" : "border-border-strong",
        !editable && "bg-surface-2 opacity-60",
        className,
      )}
    >
      {startAdornment}
      <TextInput
        ref={ref}
        editable={editable}
        placeholderTextColor={withAlpha(colors["fg-muted"], 0.7)}
        selectionColor={colors.primary}
        accessibilityState={{ disabled: !editable }}
        className="h-full flex-1 py-0 font-sans text-[16px] text-fg"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {endAdornment}
    </View>
  );
});

/** Multi-line field for messages and delivery notes. */
export const Textarea = forwardRef<TextInput, InputProps>(function Textarea(
  { invalid, className, onFocus, onBlur, editable = true, ...props },
  ref,
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      className={cn(
        "min-h-28 rounded-control border bg-surface px-3.5 py-3",
        invalid ? "border-danger" : focused ? "border-primary" : "border-border-strong",
        !editable && "bg-surface-2 opacity-60",
        className,
      )}
    >
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        editable={editable}
        placeholderTextColor={withAlpha(colors["fg-muted"], 0.7)}
        selectionColor={colors.primary}
        className="min-h-20 p-0 font-sans text-[16px] leading-[22px] text-fg"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
});
