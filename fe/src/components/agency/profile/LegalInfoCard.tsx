import { UserRound, BadgeCheck, FileText, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AgencyProfile } from "@/types/agency";
import { formatDate } from "@/utils/formatDate";
import FieldRow from "./FieldRow";

interface Props {
  profile: AgencyProfile;
}
const LegalInfoCard: React.FC<Props> = ({ profile }) => {
  return (
    <Card className="rounded-xl bg-slate-50 shadow-md mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5" />
          Pháp lý
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <FieldRow
          icon={<UserRound className="h-4 w-4" />}
          label="Người đại diện"
          value={profile.legal_representative_name}
        />

        <FieldRow
          icon={<BadgeCheck className="h-4 w-4" />}
          label="CCCD/CMND"
          value={profile.legal_id_number}
        />

        <FieldRow
          icon={<FileText className="h-4 w-4" />}
          label="Mã số thuế"
          value={profile.tax_code ?? "Chưa cập nhật"}
        />

        <Separator />

        <FieldRow
          icon={<CalendarClock className="h-4 w-4" />}
          label="Ngày đăng ký"
          value={formatDate(profile.created_at)}
        />
      </CardContent>
    </Card>
  );
};

export default LegalInfoCard;
