import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { toast } from "sonner-native";
import { ApiError } from "@/api/client";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { AddressForm, useAddressMutations, useAddresses } from "@/features/addresses";
import type { AddressInput } from "@/lib/validators/address";

/** Add (id = "new") or edit an address; presented as a modal from the address book. */
export default function AddressFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";
  const { data, isPending, isError, error, refetch } = useAddresses();
  const { create, update } = useAddressMutations();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>();
  const existing = data?.find((a) => a.id === id);

  if (!isNew && isPending) return <Skeleton className="m-4 h-96 rounded-card" />;
  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />;
  if (!isNew && !existing) return <ErrorState title="Address not found" error={undefined} />;

  const onSubmit = (address: AddressInput, makeDefault: boolean) => {
    setServerErrors(undefined);
    const options = {
      onSuccess: () => {
        toast.success(isNew ? "Address saved" : "Address updated");
        router.back();
      },
      onError: (e: unknown) => {
        if (e instanceof ApiError) {
          setServerErrors(e.fieldErrors);
          toast.error(e.message);
        } else toast.error("Couldn't save that address. Try again.");
      },
    };
    if (isNew) create.mutate({ address, makeDefault }, options);
    else update.mutate({ id, address }, options);
  };

  return (
    <>
      <Stack.Screen options={{ title: isNew ? "New address" : "Edit address" }} />
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
      >
        <AddressForm
          isEditing={!isNew}
          submitting={create.isPending || update.isPending}
          serverErrors={serverErrors}
          initial={
            existing
              ? {
                  fullName: existing.fullName,
                  phone: existing.phone,
                  line1: existing.line1,
                  line2: existing.line2 ?? "",
                  city: existing.city,
                  state: existing.state as AddressInput["state"],
                  postalCode: existing.postalCode ?? "",
                }
              : undefined
          }
          onSubmit={onSubmit}
        />
      </KeyboardAwareScrollView>
    </>
  );
}
