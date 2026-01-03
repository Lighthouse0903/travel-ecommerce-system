"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, FileText, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AgencyProfile } from "@/types/agency";
import FieldRow from "./FieldRow";

interface Props {
  profile: AgencyProfile;
}

const AgencyInfoCard: React.FC<Props> = ({ profile }) => {
  return (
    <Card className="rounded-xl bg-slate-50 shadow-md mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Thông tin đại lý
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <FieldRow
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          value={profile.email_agency}
        />
        <FieldRow
          icon={<Phone className="h-4 w-4" />}
          label="Hotline"
          value={profile.hotline}
        />
        <FieldRow
          icon={<MapPin className="h-4 w-4" />}
          label="Địa chỉ"
          value={profile.address_agency}
        />
        <Separator />
        <FieldRow
          icon={<FileText className="h-4 w-4" />}
          label="Số giấy phép"
          value={profile.license_number}
        />
      </CardContent>
    </Card>
  );
};

export default AgencyInfoCard;
