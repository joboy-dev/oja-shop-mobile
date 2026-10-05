import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { View } from "react-native";
import { cn } from "@/utils/cn";
import { Text } from "./Text";

interface FieldProps {
  label: string;
  /** Helper text under the control. */
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  /** A single form control (Input, Textarea, SelectField…). It receives `invalid` and an accessible label. */
  children: ReactNode;
}

/** Label + control + hint/error, with the error announced to screen readers when it appears. */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const child = Children.only(children);
  return (
    <View className={cn("gap-1.5", className)}>
      <Text variant="label">
        {label}
        {required && (
          <Text variant="label" tone="danger">
            {" *"}
          </Text>
        )}
      </Text>
      {isValidElement(child)
        ? cloneElement(child as ReactElement<{ invalid?: boolean; accessibilityLabel?: string }>, {
            invalid: !!error,
            accessibilityLabel: label,
          })
        : child}
      {hint && !error && (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      )}
      {error && (
        <Text
          variant="caption"
          tone="danger"
          className="font-sans-medium"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
}
