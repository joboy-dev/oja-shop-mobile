import { useRouter } from "expo-router";
import { MapPin, Plus } from "lucide-react-native";
import { Alert, FlatList, View } from "react-native";
import { toast } from "sonner-native";
import { ApiError } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { AddressCard, useAddressMutations, useAddresses } from "@/features/addresses";
import { SignInPrompt, useSessionUser } from "@/features/auth";

export default function AddressesScreen() {
  const router = useRouter();
  const { isAuthenticated } = useSessionUser();
  const { data, isPending, isError, error, refetch } = useAddresses();
  const { remove, makeDefault } = useAddressMutations();

  if (!isAuthenticated)
    return (
      <SignInPrompt
        title="Sign in to manage addresses"
        description="Saved addresses make checkout quicker."
      />
    );
  if (isPending)
    return (
      <View className="gap-3 p-4">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-card" />
        ))}
      </View>
    );
  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />;

  const confirmDelete = (id: string, name: string) =>
    Alert.alert(
      "Delete this address?",
      `The address for ${name} will be removed. Past orders aren't affected.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            remove.mutate(id, {
              onSuccess: () => toast("Address deleted"),
              onError: (e) =>
                toast.error(e instanceof ApiError ? e.message : "Couldn't delete that address."),
            }),
        },
      ],
    );

  return (
    <FlatList
      data={data}
      keyExtractor={(a) => a.id}
      contentContainerClassName="gap-3 p-4 pb-10"
      ListEmptyComponent={
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          description="Add one now or save it during checkout."
        />
      }
      ListFooterComponent={
        <Button
          size="lg"
          variant="outline"
          fullWidth
          className="mt-2"
          startIcon={<Icon as={Plus} size={18} />}
          onPress={() => router.push({ pathname: "/account/address/[id]", params: { id: "new" } })}
        >
          Add an address
        </Button>
      }
      renderItem={({ item }) => (
        <AddressCard
          address={item}
          busy={makeDefault.isPending}
          onEdit={() => router.push({ pathname: "/account/address/[id]", params: { id: item.id } })}
          onDelete={() => confirmDelete(item.id, item.fullName)}
          onMakeDefault={() =>
            makeDefault.mutate(item.id, {
              onError: (e) =>
                toast.error(e instanceof ApiError ? e.message : "Couldn't change your default address."),
            })
          }
        />
      )}
    />
  );
}
