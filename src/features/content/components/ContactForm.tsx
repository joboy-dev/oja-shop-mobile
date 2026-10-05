import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { ApiError } from "@/api/client";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Textarea } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { useZodForm } from "@/hooks/useZodForm";
import { contactSchema } from "@/lib/validators/contact";
import { sendContactMessage } from "../content.api";

/** Name, email, subject and message; a success panel replaces the form once sent (web: ContactForm). */
export function ContactForm({ defaults }: { defaults?: { name?: string; email?: string } }) {
  const form = useZodForm(contactSchema, {
    name: defaults?.name ?? "",
    email: defaults?.email ?? "",
    subject: "",
    message: "",
  });
  const [serverError, setServerError] = useState<string>();
  const send = useMutation({ mutationFn: sendContactMessage });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(undefined);
    try {
      await send.mutateAsync(values);
    } catch (err) {
      setServerError(
        err instanceof ApiError
          ? err.message
          : "We couldn't send your message. Please try again in a moment.",
      );
      if (err instanceof ApiError)
        for (const [field, messages] of Object.entries(err.fieldErrors ?? {}))
          form.setError(field as never, { message: messages[0] });
    }
  });

  if (send.isSuccess) {
    return (
      <View
        accessibilityRole="alert"
        className="items-center rounded-sheet border border-success/30 bg-success-soft p-8"
      >
        <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-success">
          <Icon as={Check} size={24} color="#ffffff" strokeWidth={3} />
        </View>
        <Text variant="h2" className="text-center">
          Message sent
        </Text>
        <Text tone="muted" className="mt-2 text-center">
          Thanks for writing. We reply within one working day, usually sooner.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-5">
      <FormInput control={form.control} name="name" label="Your name" required autoComplete="name" />
      <FormInput
        control={form.control}
        name="email"
        label="Email"
        required
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <FormInput
        control={form.control}
        name="subject"
        label="Subject"
        required
        placeholder="Order OJ-XXXXXX, a question about a piece…"
      />
      <Controller
        control={form.control}
        name="message"
        render={({ field, fieldState }) => (
          <Field label="Message" required error={fieldState.error?.message}>
            <Textarea
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              className="min-h-40"
            />
          </Field>
        )}
      />
      {serverError && (
        <View accessibilityRole="alert" className="rounded-control bg-danger-soft px-4 py-3">
          <Text variant="caption" tone="danger" className="font-sans-medium">
            {serverError}
          </Text>
        </View>
      )}
      <Button size="lg" isLoading={send.isPending} onPress={onSubmit}>
        Send message
      </Button>
    </View>
  );
}
