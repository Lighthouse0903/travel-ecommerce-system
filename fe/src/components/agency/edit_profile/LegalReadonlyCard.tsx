"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

import type { AgencyProfile } from "@/types/agency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  profile: AgencyProfile;
}

const LegalReadonlyCard: React.FC<Props> = ({ profile }) => {
  return (
    <Card className="rounded-xl bg-slate-50 shadow-md mb-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Thông tin pháp lý (chỉ xem)
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground space-y-2">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span>
            Số giấy phép:{" "}
            <b className="text-foreground">{profile.license_number}</b>
          </span>
          <span>
            Người đại diện:{" "}
            <b className="text-foreground">
              {profile.legal_representative_name}
            </b>
          </span>
          <span>
            CCCD/CMND:{" "}
            <b className="text-foreground">{profile.legal_id_number}</b>
          </span>
          <span>
            MST: <b className="text-foreground">{profile.tax_code ?? "—"}</b>
          </span>
        </div>

        <Separator />

        <p className="text-xs">
          Nếu cần thay đổi thông tin pháp lý, vui lòng liên hệ Admin (có thể cần
          duyệt lại).
        </p>
      </CardContent>
    </Card>
  );
};

export default LegalReadonlyCard;
