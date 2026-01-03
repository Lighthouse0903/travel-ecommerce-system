import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const TermsHero = () => {
  return (
    <section className="w-full">
      <div className="bg-white/10 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 items-center">
        {/* cột trái*/}
        <div className="space-y-6">
          {/* badge */}
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs sm:text-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-muted-foreground">
              Phiên bản{" "}
              <span className="font-semibold text-foreground">v1.0</span> • Hiệu
              lực từ{" "}
              <span className="font-semibold text-foreground">01/10/2023</span>
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05]">
              <span className="block">Điều khoản & Quy</span>
              <span className="block">định</span>
              <span className="block text-blue-600">Đăng ký Đại lý</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Chào mừng bạn gia nhập mạng lưới du lịch thông minh. Vui lòng xem
              xét kỹ các điều khoản hợp tác để đảm bảo quyền lợi và trách nhiệm
              của cả hai bên.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button asChild className="sm:w-auto">
              <a href="/docs/terms-agency.pdf" target="_blank" rel="noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Tải bản PDF
              </a>
            </Button>

            <div className="text-xs sm:text-sm text-muted-foreground">
              Bạn có thể đọc online và tiếp tục ở bước bên dưới.
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className="relative">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border bg-background shadow-md">
            <Image
              src="https://i.pinimg.com/736x/52/e0/43/52e04383cfa4738f5d2048490601d78f.jpg"
              alt="Terms Hero"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-black/0" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default TermsHero;
