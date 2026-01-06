"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgencyProfile } from "@/types/agency";
import DocTile from "./DocTile";

interface Props {
  profile: AgencyProfile;
}

const DocumentsCard: React.FC<Props> = ({ profile }) => {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <FileText className="h-5 w-5 text-slate-600" />
          Tài liệu
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <DocTile title="Logo" url={profile.avatar_url} />
        <DocTile title="Giấy phép kinh doanh" url={profile.license_url} />
        <DocTile title="CCCD mặt trước" url={profile.legal_id_front_url} />
        <DocTile title="CCCD mặt sau" url={profile.legal_id_back_url} />
      </CardContent>
    </Card>
  );
};

export default DocumentsCard;
