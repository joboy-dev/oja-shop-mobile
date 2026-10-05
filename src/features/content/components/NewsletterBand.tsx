import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { ApiError } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { newsletterSchema } from "@/lib/validators/contact";
import { subscribeToNewsletter } from "../content.api";

/** "First look at new pieces" card with an email field (web: NewsletterBand + NewsletterForm). */
export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const subscribe = useMutation({
    mutationFn: subscribeToNewsletter,
    onError: (e) =>
      setError(e instanceof ApiError ? e.message : "We couldn't sign you up. Please try again."),
  });

  const submit = () => {
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
    setError(undefined);
    subscribe.mutate(parsed.data.email);
  };

  return (
    <View className="mx-4 my-8 rounded-sheet border border-border bg-surface p-6">
      <Text variant="h2">First look at new pieces</Text>
      <Text tone="muted" className="mt-3">
        One email a month when a new batch lands. Small runs sell out, so subscribers get a head start.
      </Text>
      {subscribe.isSuccess ? (
        <View
          accessibilityLiveRegion="polite"
          className="mt-5 flex-row items-center gap-3 rounded-control bg-success-soft p-4"
        >
          <Icon as={Check} size={20} tone="success" strokeWidth={3} />
          <Text variant="label" tone="success" className="flex-1">
            {subscribe.data.alreadySubscribed
              ? "You're already on the list."
              : "You're on the list. Thank you!"}
          </Text>
        </View>
      ) : (
        <View className="mt-5 gap-3">
          <Field label="Email address" error={error}>
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@example.com"
              returnKeyType="send"
              onSubmitEditing={submit}
            />
          </Field>
          <Button size="lg" isLoading={subscribe.isPending} onPress={submit}>
            Subscribe
          </Button>
        </View>
      )}
    </View>
  );
}
