import { Pencil, Trash2 } from "lucide-react-native";
import { View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Button, IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import type { AddressDTO } from "@/lib/types/address";

/** One saved address with edit, delete and "make default" (web: AddressBook card). */
export function AddressCard({
  address,
  onEdit,
  onDelete,
  onMakeDefault,
  busy,
}: {
  address: AddressDTO;
  onEdit: () => void;
  onDelete: () => void;
  onMakeDefault: () => void;
  busy?: boolean;
}) {
  return (
    <View className="gap-3 rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <Text variant="label" className="text-[16px]">
            {address.fullName}
          </Text>
          <Text variant="bodySm" tone="muted">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
          </Text>
          <Text
            variant="bodySm"
            tone="muted"
          >{`${address.city}, ${address.state}${address.postalCode ? ` ${address.postalCode}` : ""}`}</Text>
          <Text variant="bodySm" tone="muted">
            {address.phone}
          </Text>
        </View>
        {address.isDefault && <Badge tone="primary">Default</Badge>}
      </View>
      <View className="flex-row items-center justify-between">
        {address.isDefault ? (
          <View />
        ) : (
          <Button variant="ghost" size="sm" disabled={busy} onPress={onMakeDefault} className="-ml-3">
            Make default
          </Button>
        )}
        <View className="flex-row">
          <IconButton label={`Edit address for ${address.fullName}`} onPress={onEdit}>
            <Icon as={Pencil} size={18} />
          </IconButton>
          <IconButton label={`Delete address for ${address.fullName}`} onPress={onDelete}>
            <Icon as={Trash2} size={18} tone="danger" />
          </IconButton>
        </View>
      </View>
    </View>
  );
}
