import { ScrollView } from "react-native";
import { Accordion } from "@/components/ui/Accordion";
import { Text } from "@/components/ui/Text";
import { PageHeading, faqItems } from "@/features/content";

export default function FaqScreen() {
  return (
    <ScrollView contentContainerClassName="gap-8 px-4 pb-10 pt-4" showsVerticalScrollIndicator={false}>
      <PageHeading eyebrow="Help" title="Frequently asked questions" />
      <Accordion
        items={faqItems.map((i) => ({
          id: i.id,
          title: i.title,
          content: <Text tone="muted">{i.content}</Text>,
        }))}
      />
    </ScrollView>
  );
}
