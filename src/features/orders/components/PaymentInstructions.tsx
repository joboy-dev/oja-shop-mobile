import { Landmark } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import type { BankDetails } from "@/lib/types/order";
import { formatMoney } from "@/utils/money";

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View className="w-1/2 pb-3 pr-2">
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant={mono ? "priceMd" : "label"} className={mono ? undefined : "text-[16px]"} selectable>
        {value}
      </Text>
    </View>
  );
}

/** Bank-transfer details with the order number as the reference (web: PaymentInstructions). */
export function PaymentInstructions({
  bank,
  orderNumber,
  total,
}: {
  bank: BankDetails | null;
  orderNumber: string;
  total: number;
}) {
  return (
    <View className="rounded-card border border-primary/30 bg-primary-soft p-5">
      <View className="flex-row items-center gap-2">
        <Icon as={Landmark} size={20} tone="primary" />
        <Text variant="label" className="text-[16px]">
          Pay by bank transfer
        </Text>
      </View>
      {bank ? (
        <>
          <View className="mt-4 flex-row flex-wrap">
            <Detail label="Bank" value={bank.bank} />
            <Detail label="Account name" value={bank.accountName} />
            <Detail label="Account number" value={bank.accountNumber} mono />
            <Detail label="Amount" value={formatMoney(total)} mono />
          </View>
          <Text variant="caption" tone="muted">
            {"Use "}
            <Text variant="mono" className="font-mono-medium">
              {orderNumber}
            </Text>
            {" as the transfer reference. We ship as soon as it lands."}
          </Text>
        </>
      ) : (
        <Text variant="bodySm" tone="muted" className="mt-2">
          {"We'll email our account details shortly. Quote "}
          <Text variant="mono" className="font-mono-medium">
            {orderNumber}
          </Text>
          {" as your reference."}
        </Text>
      )}
    </View>
  );
}
