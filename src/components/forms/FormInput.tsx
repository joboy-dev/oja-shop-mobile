import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import type { ComponentProps } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  required?: boolean;
  /** Server-side field errors (from a 400 response) shown when the form has none of its own. */
  serverError?: string;
} & Omit<ComponentProps<typeof Input>, "value" | "onChangeText" | "onBlur" | "invalid">;

/** react-hook-form field: Controller + Field + Input, so screens declare fields in one line each. */
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  required,
  serverError,
  ...inputProps
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field label={label} hint={hint} required={required} error={fieldState.error?.message ?? serverError}>
          <Input
            ref={field.ref}
            value={(field.value as string | undefined) ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            {...inputProps}
          />
        </Field>
      )}
    />
  );
}
