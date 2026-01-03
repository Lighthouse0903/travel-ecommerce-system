import { z } from "zod";
import { step1Schema, step2Schema, step3Schema } from "../../create/formSchema";
import { Accommodation } from "@/types/tour";

export const editStep4Schema = z.object({
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
  is_active: z.boolean().optional(),

  thumbnail: z
    .any()
    .optional()
    .refine(
      (v) => v === undefined || v instanceof File,
      "Thumbnail không hợp lệ."
    )
    .refine(
      (v) =>
        v === undefined || (v instanceof File && v.type?.startsWith("image/")),
      "Thumbnail phải là ảnh."
    ),

  images: z
    .array(z.any())
    .optional()
    .refine(
      (arr) => arr === undefined || arr.every((f) => f instanceof File),
      "Ảnh gallery không hợp lệ."
    )
    .refine(
      (arr) =>
        arr === undefined ||
        arr.every((f) => f instanceof File && f.type?.startsWith("image/")),
      "Gallery phải là ảnh."
    ),
});

export const editTourSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(editStep4Schema);

export type EditTourFormValues = z.infer<typeof editTourSchema>;
