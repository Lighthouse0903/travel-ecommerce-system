import z from "zod";

// cập nhật hồ sơ
export const editProfileSchema = z.object({
  username: z
    .string()
    .min(2, "Tên đăng nhập phải có ít nhất 2 kí tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Username không được chứa ký tự đặc biệt"),
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^(0|\+84)[0-9]{9}$/.test(val), {
      message: "Số điện thoại không hợp lệ",
    }),
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: "Địa chỉ phải có ít nhất 5 ký tự",
    }),
  date_of_birth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ngày sinh không hợp lệ",
    }),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
