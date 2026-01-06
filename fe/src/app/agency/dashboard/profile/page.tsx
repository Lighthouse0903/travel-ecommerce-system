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
import AgencyProfileSkeleton from "./AgencyProfileSkeleton";

const AgencyProfilePage = () => {
  const router = useRouter();
  const { loading, profile } = useAgencyProfile();

  if (loading) {
    return <AgencyProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex-1 w-full p-4">
        <div className="w-full max-w-5xl">
          <Card className="rounded-2xl border border-slate-200 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Chưa có hồ sơ đại lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>
                Tài khoản của bạn chưa đăng ký đại lý hoặc hồ sơ không tồn tại.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                onClick={() => router.push("/dashboard/register_agency/terms")}
              >
                Đăng ký đại lý
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-4">
      <div className="w-full space-y-6">
        <ProfileHeader profile={profile} />

        <div className="grid gap-5 md:grid-cols-2">
          <AgencyInfoCard profile={profile} />
          <LegalInfoCard profile={profile} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <BankInfoCard profile={profile} />
          <AboutCard description={profile.description} />

          <div className="md:col-span-2">
            <DocumentsCard profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyProfilePage;
