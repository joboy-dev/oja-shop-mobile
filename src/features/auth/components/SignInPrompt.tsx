import { LockKeyhole } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { signInWithGoogle } from "../auth.actions";

/** Google sign-in button used on the login screen and in "sign in to see this" panels. */
export function GoogleSignInButton({ size = "lg" }: { size?: "md" | "lg" }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size={size}
      isLoading={busy}
      onPress={async () => {
        setBusy(true);
        try {
          const res = await signInWithGoogle();
          if (res?.error) toast.error(res.error.message ?? "Couldn't sign you in. Please try again.");
        } catch {
          toast.error("Couldn't reach Google. Check your connection and try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      Continue with Google
    </Button>
  );
}

/** Shown in place of a signed-in-only screen (wishlist, account). */
export function SignInPrompt({ title, description }: { title: string; description: string }) {
  return (
    <View className="px-4 pt-6">
      <EmptyState
        icon={LockKeyhole}
        title={title}
        description={description}
        action={<GoogleSignInButton />}
      />
    </View>
  );
}
