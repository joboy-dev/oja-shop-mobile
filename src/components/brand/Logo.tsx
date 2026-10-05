import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { siteConfig } from "@/lib/config/site";
import { LogoMark } from "./LogoMark";

export function Logo() {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={siteConfig.name}
      className="flex-row items-center gap-2.5"
    >
      <LogoMark />
      <Text variant="h2" className="text-[24px] leading-[26px]">
        {siteConfig.name}
      </Text>
    </View>
  );
}
