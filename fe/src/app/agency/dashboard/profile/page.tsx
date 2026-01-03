"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAgencyProfile } from "@/contexts/AgencyProfileContext";

import ProfileHeader from "@/components/agency/profile/ProfileHeader";
import AgencyInfoCard from "@/components/agency/profile/AgencyInfoCard";
import LegalInfoCard from "@/components/agency/profile/LegalInfoCard";
import BankInfoCard from "@/components/agency/profile/BankInfoCard";
import DocumentsCard from "@/components/agency/profile/DocumentsCard";
import AboutCard from "@/components/agency/profile/AboutCard";
import MotionFlow, { MotionItem } from "@/components/common/motion/MotionFlow";
import AgencyProfileSkeleton from "./AgencyProfileSkeleton";

const AgencyProfilePage = () => {
  const router = useRouter();
  const { loading, profile } = useAgencyProfile();

  if (loading) {
    return (
      <>
        <AgencyProfileSkeleton />
      </>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 w-full rounded-xl bg-background p-6">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Chưa có hồ sơ đại lý</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Tài khoản của bạn chưa đăng ký đại lý hoặc hồ sơ không tồn tại.
            </p>
            <Button
              onClick={() => router.push("/dashboard/register_agency/terms")}
            >
              Đăng ký đại lý
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full rounded-xl bg-white space-y-6 px-2">
      <MotionFlow>
        {/* Header */}
        <MotionItem>
          <ProfileHeader profile={profile} />
        </MotionItem>

        {/* Thông tin + Pháp lý */}
        <MotionItem>
          <div className="grid gap-5 md:grid-cols-2">
            <AgencyInfoCard profile={profile} />
            <LegalInfoCard profile={profile} />
          </div>
        </MotionItem>

        {/* Ngân hàng, mô tả, tài liệu */}
        <MotionItem>
          <div className="grid gap-5 md:grid-cols-2">
            <BankInfoCard profile={profile} />
            <AboutCard description={profile.description} />

            <div className="md:col-span-2">
              <DocumentsCard profile={profile} />
            </div>
          </div>
        </MotionItem>
      </MotionFlow>
    </div>
  );
};

export default AgencyProfilePage;
