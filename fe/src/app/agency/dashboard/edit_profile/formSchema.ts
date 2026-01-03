import { z } from "zod";
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
