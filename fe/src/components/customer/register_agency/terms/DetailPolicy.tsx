"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Sparkles,
  ShieldCheck,
  Gavel,
  Wallet,
  LockKeyhole,
  Headset,
} from "lucide-react";

type Section = {
  key: string;
  title: string;
  icon: React.ElementType;
  bullets: string[];
};

const sections: Section[] = [
  {
    key: "benefits",
    title: "Lợi ích khi trở thành Đại lý",
    icon: Sparkles,
    bullets: [
      "Tiếp cận khách hàng: Hồ sơ đại lý được hiển thị trên nền tảng, hỗ trợ tăng lượt tiếp cận và tỷ lệ chuyển đổi.",
      "Công cụ quản lý: Quản lý tour, booking, lịch khởi hành và báo cáo doanh thu theo thời gian thực.",
      "Hỗ trợ marketing: Tham gia các chiến dịch truyền thông/khuyến mãi của nền tảng.",
    ],
  },
  {
    key: "commitments",
    title: "Nghĩa vụ & Cam kết của Đại lý",
    icon: ShieldCheck,
    bullets: [
      "Cung cấp thông tin chính xác: Đại lý chịu trách nhiệm về tính chính xác của thông tin tour/dịch vụ đăng tải.",
      "Tuân thủ chất lượng dịch vụ: Đảm bảo thực hiện đúng lịch trình, tiêu chuẩn đã công bố với khách hàng.",
      "Xử lý khiếu nại: Phối hợp với nền tảng để xử lý phản hồi, khiếu nại và yêu cầu hỗ trợ của khách hàng.",
    ],
  },
  {
    key: "platform-terms",
    title: "Điều khoản sử dụng nền tảng",
    icon: Gavel,
    bullets: [
      "Bảo mật tài khoản: Không chia sẻ tài khoản, không sử dụng trái phép thông tin đăng nhập của người khác.",
      "Nội dung bị cấm: Không đăng nội dung sai sự thật, vi phạm bản quyền, lừa đảo, hoặc gây hiểu nhầm.",
      "Tuân thủ quy trình: Thực hiện đúng quy trình xác nhận booking, cập nhật trạng thái và hoàn/huỷ.",
    ],
  },
  {
    key: "payment-commission",
    title: "Thanh toán & Phí nền tảng",
    icon: Wallet,
    bullets: [
      "Khách hàng thanh toán qua nền tảng để đảm bảo an toàn và minh bạch giao dịch.",
      "Nền tảng thu phí dịch vụ (hoa hồng) theo tỷ lệ công bố trên mỗi booking thành công.",
      "Doanh thu của đại lý được đối soát định kỳ và chi trả sau khi trừ phí nền tảng và xử lý hoàn/huỷ.",
    ],
  },
  {
    key: "privacy",
    title: "Chính sách dữ liệu & Quyền riêng tư",
    icon: LockKeyhole,
    bullets: [
      "Bảo mật thông tin khách hàng: Đại lý không được chia sẻ dữ liệu khách hàng cho bên thứ ba khi chưa được phép.",
      "Sử dụng dữ liệu đúng mục đích: Chỉ dùng dữ liệu để phục vụ việc cung cấp dịch vụ/booking trên nền tảng.",
      "Tuân thủ quy định: Thực hiện theo chính sách bảo mật và quy định pháp luật liên quan.",
    ],
  },
  {
    key: "support",
    title: "Liên hệ hỗ trợ",
    icon: Headset,
    bullets: [
      "Kênh hỗ trợ: Email/Hotline/Chat.",
      "Thời gian phản hồi: 24–48h làm việc.",
      "Góp ý: Đại lý có thể gửi đề xuất cải thiện để nâng cao trải nghiệm hợp tác.",
    ],
  },
];

const DetailPolicy = () => {
  return (
    <section className="w-full pt-1 pb-6">
      <div className=" bg-white/10 shadow-lg px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 pt-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Chi tiết điều khoản
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Vui lòng đọc kỹ các nội dung dưới đây.
          </p>
        </div>

        {/* Accordion */}
        <div className="rounded-sm shadow-sm pb-5">
          <Accordion
            type="single"
            collapsible
            defaultValue={sections[0].key}
            className="divide-y border "
          >
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <AccordionItem
                  key={sec.key}
                  value={sec.key}
                  className="px-4 sm:px-6 bg-slate-100"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base">
                        {sec.title}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-5">
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground leading-relaxed">
                      {sec.bullets.map((b, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600/70 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
export default DetailPolicy;
