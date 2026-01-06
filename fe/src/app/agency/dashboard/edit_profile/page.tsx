"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAgencyProfile } from "@/contexts/AgencyProfileContext";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import AvatarCard from "@/components/agency/edit_profile/AvatarCard";
import ContactInfoCard from "@/components/agency/edit_profile/ContactInforCard";
import BankInfoFormCard from "@/components/agency/edit_profile/BankInfoFormCard";
import AboutFormCard from "@/components/agency/edit_profile/AboutFormCard";
import LegalReadonlyCard from "@/components/agency/edit_profile/LegalReadonlyCard";
import EditProfileHeader from "@/components/agency/edit_profile/EditProfileHeader";
import { useAgencyAction } from "@/hooks/useAgencyAction";

import EditAgencyProfileSkeleton from "./EditProlileSkeleton";
import { EditAgencyFormValues, EditAgencySchema } from "@/types/agency";

const EditAgencyProfilePage = () => {
  const router = useRouter();
  const { profile, loading } = useAgencyProfile();
  const { submitUpdateAgencyProfile } = useAgencyAction();

  const form = useForm<EditAgencyFormValues>({
    mode: "onTouched",
    resolver: zodResolver(EditAgencySchema),
    defaultValues: {
      avatar: null,
      email_agency: "",
      hotline: "",
      address_agency: "",
      bank_name: "",
      bank_account_number: "",
      bank_account_holder: "",
      description: "",
    },
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    form.reset({
      avatar: null,
      email_agency: profile.email_agency ?? "",
      hotline: profile.hotline ?? "",
      address_agency: profile.address_agency ?? "",
      bank_name: profile.bank_name ?? "",
      bank_account_number: profile.bank_account_number ?? "",
      bank_account_holder: profile.bank_account_holder ?? "",
      description: profile.description ?? "",
    });

    setAvatarPreview(profile.avatar_url ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:"))
        URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: EditAgencyFormValues) => {
    await submitUpdateAgencyProfile(values);
  };

  if (loading) {
    return <EditAgencyProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="w-full p-4">
        <div className="w-full ">
          <Card className="rounded-2xl border border-slate-200 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Không tìm thấy hồ sơ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => router.push("/agency/dashboard/profile")}
              >
                Quay lại
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
        <EditProfileHeader
          profile={profile}
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
          formId="edit-agency-form"
        />

        <Form {...form}>
          <form
            id="edit-agency-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <AvatarCard isSubmitting={isSubmitting} />
              <ContactInfoCard isSubmitting={isSubmitting} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <BankInfoFormCard isSubmitting={isSubmitting} />
              <AboutFormCard isSubmitting={isSubmitting} />
            </div>

            <div>
              <LegalReadonlyCard profile={profile} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditAgencyProfilePage;
