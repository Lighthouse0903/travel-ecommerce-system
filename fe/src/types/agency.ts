import { z } from "zod";
export type AgencyStatus = "pending" | "approved" | "rejected";
export type AgencyType = "business" | "individual";

// thông tin response khi đănng kí và getProfileAgency trả về
export interface AgencyProfile {
  agency_id: string;

  agency_name: string;
  agency_type: AgencyType;
  license_number: string;
  hotline: string;
  email_agency: string;
  address_agency: string;
  description: string | null;

  legal_representative_name: string;
  legal_id_number: string;
  tax_code: string | null;

  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;

  avatar_url: string | null;
  license_url: string | null;
  legal_id_front_url: string | null;
  legal_id_back_url: string | null;

  verified: boolean;
  status: AgencyStatus;
  reason_rejected: string | null;

  created_at: string;
  updated_at: string;
}

// type của Form khi đăng kí đại lý
export type RegisterAgencyFormValues = {
  agency_name?: string;
  agency_type?: AgencyType;
  email_agency?: string;
  hotline?: string;
  address_agency?: string;
  description?: string;

  license_number?: string;
  legal_representative_name?: string;
  legal_id_number?: string;
  tax_code?: string;

  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;

  license_file?: File | null;
  legal_id_front?: File | null;
  legal_id_back?: File | null;
  avatar?: File | null;
};

// type của form cập nhật
export type EditAgencyProfileValues = {
  avatar: File | null;

  email_agency: string;
  hotline: string;
  address_agency: string;

  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;

  description: string;
};

export const EditAgencySchema = z.object({
  avatar: z
    .any()
    .optional()
    .nullable()
    .refine((f) => f == null || f instanceof File, "Avatar không hợp lệ.")
    .refine(
      (f) =>
        f == null ||
        ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type),
      "Avatar phải là ảnh (png/jpg/jpeg/webp)."
    )
    .refine(
      (f) => f == null || f.size <= 5 * 1024 * 1024,
      "Avatar tối đa 5MB."
    ),

  email_agency: z.string().trim().email("Email không hợp lệ."),
  hotline: z
    .string()
    .trim()
    .min(8, "Hotline quá ngắn.")
    .max(20, "Hotline quá dài."),
  address_agency: z
    .string()
    .trim()
    .min(5, "Địa chỉ quá ngắn.")
    .max(255, "Địa chỉ quá dài."),

  bank_name: z
    .string()
    .trim()
    .min(2, "Tên ngân hàng quá ngắn.")
    .max(100, "Tên ngân hàng quá dài."),
  bank_account_number: z
    .string()
    .trim()
    .min(6, "Số tài khoản quá ngắn.")
    .max(32, "Số tài khoản quá dài."),
  bank_account_holder: z
    .string()
    .trim()
    .min(2, "Tên chủ tài khoản quá ngắn.")
    .max(100, "Tên chủ tài khoản quá dài."),
  description: z
    .string()
    .trim()
    .max(2000, "Mô tả tối đa 2000 ký tự.")
    .optional(),
});
export type EditAgencyFormValues = z.infer<typeof EditAgencySchema>;
