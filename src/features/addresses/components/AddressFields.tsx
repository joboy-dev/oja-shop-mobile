import { useRef } from "react";
import { View } from "react-native";
import { Controller, type Control, type FieldValues } from "react-hook-form";
import { FormInput } from "@/components/forms/FormInput";
import { Field } from "@/components/ui/Field";
import { SelectField, SelectSheet } from "@/components/ui/SelectSheet";
import type { SheetRef } from "@/components/ui/Sheet";
import { nigerianStates } from "@/lib/config/nigeria";

/**
 * The address inputs, shared by checkout (nested under `address.`) and the address book (flat).
 * Loosely typed on purpose: it works against two different form shapes, addressed by `prefix`.
 */
export function AddressFields({
  control,
  prefix = "",
  serverErrors,
}: {
  control: Control<FieldValues>;
  prefix?: string;
  serverErrors?: Record<string, string[]>;
}) {
  const stateSheet = useRef<SheetRef>(null);
  const name = (key: string) => `${prefix}${key}`;
  const server = (key: string) => serverErrors?.[key]?.[0];

  return (
    <View className="gap-5">
      <FormInput
        control={control}
        name={name("fullName")}
        label="Recipient's full name"
        required
        autoComplete="name"
        textContentType="name"
        serverError={server("fullName")}
      />
      <FormInput
        control={control}
        name={name("phone")}
        label="Recipient's phone"
        hint="The courier calls this number."
        required
        keyboardType="phone-pad"
        autoComplete="tel"
        placeholder="0803 123 4567"
        serverError={server("phone")}
      />
      <FormInput
        control={control}
        name={name("line1")}
        label="Street address"
        required
        autoComplete="address-line1"
        placeholder="House number and street"
        serverError={server("line1")}
      />
      <FormInput
        control={control}
        name={name("line2")}
        label="Apartment, landmark or estate (optional)"
        autoComplete="address-line2"
        serverError={server("line2")}
      />
      <FormInput
        control={control}
        name={name("city")}
        label="City or town"
        required
        autoComplete="postal-address-locality"
        serverError={server("city")}
      />
      <Controller
        control={control}
        name={name("state")}
        render={({ field, fieldState }) => (
          <>
            <Field label="State" required error={fieldState.error?.message ?? server("state")}>
              <SelectField
                value={field.value || undefined}
                placeholder="Choose a state"
                onPress={() => stateSheet.current?.present()}
              />
            </Field>
            <SelectSheet
              ref={stateSheet}
              title="State"
              value={field.value}
              options={nigerianStates.map((s) => ({ value: s, label: s }))}
              onChange={field.onChange}
            />
          </>
        )}
      />
      <FormInput
        control={control}
        name={name("postalCode")}
        label="Postal code (optional)"
        keyboardType="number-pad"
        autoComplete="postal-code"
        serverError={server("postalCode")}
      />
    </View>
  );
}
