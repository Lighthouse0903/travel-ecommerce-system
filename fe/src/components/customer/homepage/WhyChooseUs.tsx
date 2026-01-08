import React from "react";
import { Sparkles, Handshake, Headset, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type Item = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  {
    title: "Gợi ý thông minh từ AI",
    desc: "Lên lịch trình cá nhân hoá chỉ trong vài giây dựa trên sở thích riêng của bạn, tối ưu từng điểm đến.",
    icon: <Sparkles className="h-5 w-5 text-primary" />,
  },
  {
    title: "Mạng lưới đối tác rộng lớn",
    desc: "Kết nối trực tiếp với hàng ngàn đại lý và khách sạn uy tín trên toàn cầu, mang lại lựa chọn đa dạng.",
    icon: <Handshake className="h-5 w-5 text-primary" />,
  },
  {
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải quyết mọi vấn đề mọi lúc, mọi nơi để bạn yên tâm tận hưởng.",
    icon: <Headset className="h-5 w-5 text-primary" />,
  },
  {
    title: "Chi phí tối ưu",
    desc: "So sánh và tìm ra mức giá tốt nhất thị trường nhờ thuật toán thông minh, tiết kiệm tối đa cho ví tiền của bạn.",
    icon: <Wallet className="h-5 w-5 text-primary" />,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto w-[95%] md:w-[90%] py-10 md:py-14">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
            Khám phá thế giới thông minh hơn với công nghệ AI tiên phong và dịch
            vụ tận tâm. Chúng tôi biến mỗi chuyến đi thành trải nghiệm độc nhất
            vô nhị.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map((it) => (
            <Card
              key={it.title}
              className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  {it.icon}
                </div>

                <h3 className="mt-5 text-base md:text-lg font-semibold text-foreground">
                  {it.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {it.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
