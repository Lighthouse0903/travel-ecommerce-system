"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import { RegisterAgencyFormValues } from "@/types/agency";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="sm:col-span-2 text-sm font-medium break-words">
      {value ?? <span className="text-muted-foreground">—</span>}
    </div>
  </div>
);

const useFilePreview = (file?: File | null) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type?.startsWith("image/")) {
      setUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
};

const PreviewRow = ({
  label,
  file,
  previewUrl,
}: {
  label: string;
  file?: File | null;
  previewUrl: string | null;
}) => (
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 items-start">
    <div className="text-sm text-muted-foreground">{label}</div>

    <div className="sm:col-span-2 space-y-2">
      <div className="text-sm font-medium break-words">
        {file?.name ?? <span className="text-muted-foreground">—</span>}
      </div>

      {previewUrl && (
        <div className="w-full max-w-sm overflow-hidden rounded-xl border">
          <img
            src={previewUrl}
            alt={label}
            className="h-40 w-full object-cover"
          />
        </div>
      )}

      {file && !previewUrl && (
        <div className="text-xs text-muted-foreground">
          (File không phải ảnh hoặc không preview được)
        </div>
      )}
    </div>
  </div>
);

const StepReview = () => {
  const { watch, getValues } = useFormContext<RegisterAgencyFormValues>();
  watch();

  const v = useMemo(() => getValues(), [getValues]);
  const agencyType = v.agency_type || "business";
  const isBusiness = agencyType === "business";

  const licensePreview = useFilePreview(v.license_file);
  const frontPreview = useFilePreview(v.legal_id_front);
  const backPreview = useFilePreview(v.legal_id_back);
  const avatarPreview = useFilePreview(v.avatar);

  return (
    <div className="space-y-5">
      <Card className="p-4 space-y-4">
        <p className="text-sm font-semibold">1) Thông tin đại lý</p>
        <Separator />
        <div className="space-y-3">
          <Row label="Tên đại lý" value={v.agency_name} />
          <Row label="Loại đại lý" value={v.agency_type} />
          <Row label="Email" value={v.email_agency} />
          <Row label="Hotline" value={v.hotline} />
          <Row label="Địa chỉ" value={v.address_agency} />
          <Row label="Mô tả" value={v.description} />
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <p className="text-sm font-semibold">2) Pháp lý</p>
        <Separator />
        <div className="space-y-3">
          <Row label="Số giấy phép" value={v.license_number} />
          <Row label="Người đại diện" value={v.legal_representative_name} />
          <Row label="CCCD/CMND" value={v.legal_id_number} />
          {isBusiness && <Row label="Mã số thuế" value={v.tax_code} />}
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <p className="text-sm font-semibold">3) Ngân hàng</p>
        <Separator />
        <div className="space-y-3">
          <Row label="Ngân hàng" value={v.bank_name} />
          <Row label="Số tài khoản" value={v.bank_account_number} />
          <Row label="Chủ tài khoản" value={v.bank_account_holder} />
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <p className="text-sm font-semibold">4) Tài liệu</p>
        <Separator />
        <div className="space-y-4">
          <PreviewRow
            label="Giấy phép kinh doanh"
            file={v.license_file}
            previewUrl={licensePreview}
          />
          <PreviewRow
            label="CCCD/CMND mặt trước"
            file={v.legal_id_front}
            previewUrl={frontPreview}
          />
          <PreviewRow
            label="CCCD/CMND mặt sau"
            file={v.legal_id_back}
            previewUrl={backPreview}
          />
          <PreviewRow
            label="Avatar"
            file={v.avatar}
            previewUrl={avatarPreview}
          />
        </div>
      </Card>

      <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        Khi bạn bấm <b>“Xác nhận gửi đăng ký”</b>, hệ thống sẽ gửi hồ sơ lên để
        admin duyệt. Trạng thái sẽ là <b>pending</b> cho đến khi được phê duyệt.
      </div>
    </div>
  );
};

export default StepReview;
