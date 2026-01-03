"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, CalendarClock, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import type { AgencyProfile } from "@/types/agency";

interface Props {
  profile: AgencyProfile;
}

const ProfileHeader: React.FC<Props> = ({ profile }) => {
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card p-6 bg-slate-50 shadow-md mb-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-muted">
            <Image
              src={profile.avatar_url || "https://placehold.co/128x128/png"}
              alt="Agency avatar"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              {profile.agency_name}
            </h1>
            <p className="text-sm text-muted-foreground">Đại lý VietTravel</p>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-700">
                <BadgeCheck className="mr-1 h-4 w-4" />
                Đã phê duyệt
              </Badge>

              <Badge variant="outline">
                <CalendarClock className="mr-1 h-4 w-4" />
                {formatDate(profile.updated_at)}
              </Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.push("/agency/dashboard/edit_profile")}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Chỉnh sửa hồ sơ
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
