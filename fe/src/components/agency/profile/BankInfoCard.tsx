import { Landmark, CreditCard, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgencyProfile } from "@/types/agency";
import FieldRow from "./FieldRow";
import React from "react";

interface Props {
  profile: AgencyProfile;
}

const BankInfoCard: React.FC<Props> = ({ profile }) => {
  return (
    <Card className="rounded-xl bg-slate-50 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-5 w-5" />
          Ngân hàng
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <FieldRow
          icon={<Landmark className="h-4 w-4" />}
          label="Ngân hàng"
          value={profile.bank_name}
        />

        <FieldRow
          icon={<CreditCard className="h-4 w-4" />}
          label="Số tài khoản"
          value={profile.bank_account_number}
        />

        <FieldRow
          icon={<UserRound className="h-4 w-4" />}
          label="Chủ tài khoản"
          value={profile.bank_account_holder}
        />
      </CardContent>
    </Card>
  );
};
export default BankInfoCard;
