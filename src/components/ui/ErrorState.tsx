import { CloudOff } from "lucide-react-native";
import { View } from "react-native";
import { ApiError } from "@/api/client";
import { cn } from "@/utils/cn";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Text } from "./Text";

/** What went wrong and a way to retry. Pass the thrown error so network problems read differently from server ones. */
export function ErrorState({
  error,
  onRetry,
  title = "Something went wrong",
  className,
}: {
  error?: unknown;
  onRetry?: () => void;
  title?: string;
  className?: string;
}) {
  const offline = error instanceof ApiError && error.status === 0;
  const message = error instanceof ApiError ? error.message : "We couldn't load this. Please try again.";
  return (
    <View accessibilityRole="alert" className={cn("items-center px-6 py-14", className)}>
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-danger-soft">
        <Icon as={CloudOff} size={24} tone="danger" />
      </View>
      <Text variant="h3" className="text-center">
        {offline ? "You're offline" : title}
      </Text>
      <Text tone="muted" className="mt-2 max-w-[320px] text-center">
        {message}
      </Text>
      {onRetry && (
        <Button variant="outline" className="mt-6" onPress={onRetry}>
          Try again
        </Button>
      )}
    </View>
  );
}
