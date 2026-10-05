import { Clock, Mail, MapPin, Phone } from "lucide-react-native";
import { Linking, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Icon } from "@/components/ui/Icon";
import { PressableScale } from "@/components/ui/PressableScale";
import { Text } from "@/components/ui/Text";
import { useSessionUser } from "@/features/auth";
import { ContactForm, PageHeading } from "@/features/content";
import { siteConfig } from "@/lib/config/site";

const c = siteConfig.contact;
const details = [
  { icon: Mail, label: "Email", value: c.email, url: `mailto:${c.email}` },
  { icon: Phone, label: "Phone", value: c.phone, url: `tel:${c.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Studio", value: c.city },
  { icon: Clock, label: "Replies", value: "Within one working day" },
] as const;

export default function ContactScreen() {
  const { user } = useSessionUser();
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ gap: 32, paddingHorizontal: 16, paddingBottom: 48, paddingTop: 16 }}
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <PageHeading
        eyebrow="Contact"
        title="Talk to a person."
        intro="Ask about a piece, an order, a custom size or a wholesale enquiry. We read everything."
      />
      <ContactForm defaults={{ name: user?.name, email: user?.email }} />
      <View className="gap-5 rounded-sheet border border-border bg-surface p-5">
        {details.map((d) => {
          const url = "url" in d ? d.url : undefined;
          const body = (
            <View className="flex-row items-center gap-4">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-soft">
                <Icon as={d.icon} size={16} tone="primary" />
              </View>
              <View className="flex-1">
                <Text variant="eyebrow" tone="muted">
                  {d.label}
                </Text>
                <Text variant="label" className="text-[16px]">
                  {d.value}
                </Text>
              </View>
            </View>
          );
          return url ? (
            <PressableScale
              key={d.label}
              accessibilityRole="link"
              accessibilityLabel={`${d.label}: ${d.value}`}
              scaleTo={0.99}
              onPress={() => void Linking.openURL(url)}
            >
              {body}
            </PressableScale>
          ) : (
            <View key={d.label}>{body}</View>
          );
        })}
      </View>
    </KeyboardAwareScrollView>
  );
}
