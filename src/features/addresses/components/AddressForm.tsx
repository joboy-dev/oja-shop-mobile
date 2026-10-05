import type { Control, FieldValues } from "react-hook-form";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { useZodForm } from "@/hooks/useZodForm";
import { addressSchema, type AddressInput } from "@/lib/validators/address";
import { useState } from "react";
import { AddressFields } from "./AddressFields";

const empty: AddressInput = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: undefined as never,
  postalCode: "",
};

/** Add / edit form for the address book (web: AddressBook dialog). */
export function AddressForm({
  initial,
  isEditing,
  submitting,
  serverErrors,
  onSubmit,
}: {
  initial?: Partial<AddressInput>;
  isEditing: boolean;
  submitting: boolean;
  serverErrors?: Record<string, string[]>;
  onSubmit: (address: AddressInput, makeDefault: boolean) => void;
}) {
  const form = useZodForm(addressSchema, { ...empty, ...initial });
  const [makeDefault, setMakeDefault] = useState(false);

  return (
    <View className="gap-6">
      <AddressFields control={form.control as unknown as Control<FieldValues>} serverErrors={serverErrors} />
      {!isEditing && (
        <Checkbox checked={makeDefault} onChange={setMakeDefault} label="Make this my default address" />
      )}
      <Button
        size="lg"
        isLoading={submitting}
        onPress={form.handleSubmit((values) => onSubmit(values as unknown as AddressInput, makeDefault))}
      >
        {isEditing ? "Save changes" : "Save address"}
      </Button>
    </View>
  );
}
