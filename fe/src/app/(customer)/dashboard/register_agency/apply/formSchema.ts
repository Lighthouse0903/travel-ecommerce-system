import { z } from "zod";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(0|\+84)\d{9,10}$/;

// Validate cho StepBasic
export const step1Schema = z.object({
  agency_name: z.string().trim().min(1, "Vui lòng nhập tên đại lý."),
  agency_type: z.enum(["business", "individual"]),
  email_agency: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || emailRegex.test(v), {
      message: "Email không đúng định dạng.",
    }),
  hotline: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || phoneRegex.test(v), {
      message: "Số điện thoại không hợp lệ.",
    }),
  address_agency: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

// Validate cho StepLegal
export const step2Schema = z
  .object({
    license_number: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập số giấy phép kinh doanh."),
    legal_representative_name: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập tên người đại diện pháp luật."),
    legal_id_number: z.string().trim().min(1, "Vui lòng nhập số CCCD/CMND."),
    agency_type: z.enum(["business", "individual"]),
    tax_code: z.string().trim().optional().or(z.literal("")),
  })
  .superRefine((val, ctx) => {
    if (val.agency_type === "business" && !val.tax_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tax_code"],
        message: "Mã số thuế là bắt buộc đối với doanh nghiệp.",
      });
    }
  });

// Validate cho Stepbank
export const step3Schema = z.object({
  bank_name: z.string().trim().min(1, "Vui lòng nhập tên ngân hàng."),
  bank_account_number: z.string().trim().min(1, "Vui lòng nhập số tài khoản."),
  bank_account_holder: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên chủ tài khoản."),
});

// validate cho cái StepDoc
export const step4Schema = z.object({
  license_file: z
    .any()
    .refine((v) => v instanceof File, "Vui lòng tải giấy phép kinh doanh."),
  legal_id_front: z
    .any()
    .refine((v) => v instanceof File, "Vui lòng tải CCCD/CMND mặt trước."),
  legal_id_back: z
    .any()
    .refine((v) => v instanceof File, "Vui lòng tải CCCD/CMND mặt sau."),
  avatar: z.any().optional(),
});

export const schemasByStep = {
  0: step1Schema,
  1: step2Schema,
  2: step3Schema,
  3: step4Schema,
} as const;
