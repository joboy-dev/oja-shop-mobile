import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { View } from "react-native";
import { useAddresses } from "@/features/addresses";
import { useSessionUser } from "@/features/auth";
import { CheckoutFlow } from "@/features/checkout";

export default function CheckoutScreen() {
  const { user } = useSessionUser();
  const addresses = useAddresses();

  if (addresses.isError)
    return <ErrorState error={addresses.error} onRetry={() => void addresses.refetch()} />;
  if (!user || addresses.isPending) {
    return (
      <View className="gap-4 p-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-sheet" />
        ))}
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ padding: 16, paddingBottom: 64 }}
      bottomOffset={32}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <CheckoutFlow
        user={{ name: user.name, email: user.email, phone: user.phone }}
        addresses={addresses.data}
      />
    </KeyboardAwareScrollView>
  );
}
