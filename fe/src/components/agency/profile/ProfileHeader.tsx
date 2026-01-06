"use client";

import Image from "next/image";
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
    <div className="rounded-2xl border border-slate-200 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <Image
              src={profile.avatar_url || "https://placehold.co/128x128/png"}
              alt="Agency avatar"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              {profile.agency_name}
            </h1>
            <p className="text-sm text-slate-500">Đại lý VietTravel</p>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                <BadgeCheck className="mr-1 h-4 w-4" />
                Đã phê duyệt
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-200 text-slate-600"
              >
                <CalendarClock className="mr-1 h-4 w-4" />
                {formatDate(profile.updated_at)}
              </Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.push("/agency/dashboard/edit_profile")}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Edit className="h-4 w-4" />
          Chỉnh sửa hồ sơ
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
