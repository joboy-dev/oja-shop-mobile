import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";

/** Same 2-column layout and card proportions as the real grid, so nothing jumps when data arrives. */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View className="flex-row flex-wrap px-2.5" accessibilityLabel="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className="w-1/2 px-1.5 pb-6">
          <Skeleton className="aspect-[4/5] w-full rounded-card" />
          <Skeleton className="mt-3 h-3 w-16 rounded" />
          <Skeleton className="mt-2 h-4 w-4/5 rounded" />
          <Skeleton className="mt-2 h-4 w-1/3 rounded" />
        </View>
      ))}
    </View>
  );
}
