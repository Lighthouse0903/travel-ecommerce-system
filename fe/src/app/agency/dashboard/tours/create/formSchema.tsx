import { z } from "zod";

/* STEP 1: BASIC */
export const step1Schema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên tour."),

  description: z.string().optional().or(z.literal("")),

  departure_location: z.string().trim().min(1, "Vui lòng nhập nơi khởi hành."),

  destination: z.string().trim().min(1, "Vui lòng nhập điểm đến."),

  duration_days: z
    .number()
    .int("Số ngày phải là số nguyên.")
    .min(1, "Số ngày phải >= 1."),

  region: z.number().int().min(1).max(3),

  categories: z.array(z.string()).min(1, "Chọn ít nhất 1 danh mục."),
});

/* STEP 2: ITINERARY */
export const step2Schema = z.object({
  itinerary: z
    .array(
      z.object({
        day: z.number().int().min(1),

        title: z.string().trim().min(1, "Vui lòng nhập tiêu đề ngày."),

        activities: z
          .array(
            z.object({
              time: z
                .string()
                .trim()
                .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Giờ phải dạng HH:mm"),
              text: z.string().trim().min(1, "Hoạt động không được để trống."),
            })
          )
          .min(1, "Mỗi ngày phải có ít nhất 1 hoạt động."),

        accommodation: z.any().optional().nullable(),
      })
    )
    .min(1, "Vui lòng nhập lịch trình."),
});

/* STEP 3: SERVICES & PRICE */
export const step3Schema = z.object({
  adult_price: z
    .union([z.string(), z.number()])
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => v === "" || (!isNaN(Number(v)) && Number(v) >= 0),
      "Giá người lớn phải là số >= 0."
    ),

  children_price: z
    .union([z.string(), z.number()])
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => v === "" || (!isNaN(Number(v)) && Number(v) >= 0),
      "Giá trẻ em phải là số >= 0."
    ),

  discount: z
    .union([z.string(), z.number()])
    .optional()
    .or(z.literal(""))
    .refine(
      (v) =>
        v === "" || (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100),
      "Giảm giá phải nằm trong khoảng 0 - 100."
    ),

  transportation: z
    .array(z.string().trim().min(1, "Không được để trống."))
    .min(1, "Phải nhập ít nhất 1 phương tiện di chuyển."),

  services_included: z
    .array(z.string().trim().min(1, "Không được để trống."))
    .min(1, "Phải nhập ít nhất 1 dịch vụ bao gồm."),

  services_excluded: z
    .array(z.string().trim().min(1, "Không được để trống."))
    .optional(),
});

/* STEP 4: POLICY & MEDIA */
export const step4Schema = z.object({
  policy: z.object({
    deposit_percent: z
      .number()
      .min(0, "Đặt cọc phải >= 0.")
      .max(100, "Đặt cọc tối đa 100%."),

    cancellation_fee: z.string().trim().min(1, "Vui lòng nhập phí huỷ."),

    refund_policy: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập chính sách hoàn tiền."),
  }),

  thumbnail: z
    .any()
    .refine((v) => v instanceof File, "Vui lòng chọn ảnh đại diện.")
    .refine(
      (v) => v instanceof File && v.type?.startsWith("image/"),
      "Thumbnail phải là ảnh."
    ),

  images: z
    .array(z.any())
    .min(1, "Vui lòng chọn ít nhất 1 ảnh trong bộ sưu tập.")
    .refine(
      (arr) => arr.every((f) => f instanceof File),
      "Ảnh gallery không hợp lệ."
    )
    .refine(
      (arr) =>
        arr.every((f) => f instanceof File && f.type?.startsWith("image/")),
      "Gallery phải là ảnh."
    ),
});

export const schemasByStep = {
  0: step1Schema,
  1: step2Schema,
  2: step3Schema,
  3: step4Schema,
} as const;
