import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

/**
 * Landing spot for the `oja://auth-return` deep link that ends Google sign-in on Android. The Better
 * Auth client has already read the session from the link, so there is nothing to show: go back to
 * wherever the shopper was.
 */
export default function AuthReturn() {
  const router = useRouter();
  useEffect(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, [router]);
  return <View className="flex-1 bg-background" />;
}
