import { Wallet, Clock, ArrowLeftRight, BadgeCheck } from "lucide-react";

const items = [
  {
    icon: Wallet,
    title: "Phí nền tảng minh bạch",
    desc: (
      <>
        Nền tảng thu <strong>phí dịch vụ từ 10–15%</strong> trên mỗi booking
        thành công. Phần doanh thu còn lại được{" "}
        <strong>đối soát và chi trả</strong> cho đại lý theo quy định.
      </>
    ),
  },
  {
    icon: Clock,
    title: "Xét duyệt nhanh 24–48h",
    desc: (
      <>
        Hồ sơ đăng ký đại lý được kiểm tra và phản hồi nhanh chóng nhằm đảm bảo
        chất lượng đối tác và <strong>uy tín chung của nền tảng</strong>.
      </>
    ),
  },
  {
    icon: ArrowLeftRight,
    title: "Đối soát & thanh toán T+7",
    desc: (
      <>
        Doanh thu được tổng hợp và đối soát định kỳ (tuần/tháng). Thanh toán
        được thực hiện sau khi trừ <strong>phí nền tảng</strong> và xử lý
        hoàn/huỷ (nếu có).
      </>
    ),
  },
  {
    icon: BadgeCheck,
    title: "Quyền đăng tour",
    desc: (
      <>
        Sau khi được phê duyệt, đại lý có thể đăng tour, quản lý booking và theo
        dõi doanh thu trực tiếp trên hệ thống.
      </>
    ),
  },
];

const PolicySummary = () => {
  return (
    <section className="w-full pt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Tóm tắt chính sách</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Những điểm cốt lõi về quyền lợi, quy trình hợp tác và cơ chế vận
            hành dành cho đại lý trên nền tảng.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border bg-background p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default PolicySummary;
