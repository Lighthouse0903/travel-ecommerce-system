import Image from "next/image";
import ContactForm from "@/components/customer/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Section 1: Header */}
      <section className="relative w-full overflow-hidden">
        <Image
          src="https://i.pinimg.com/1200x/c0/a9/0d/c0a90dbe753e3c327fae122fbaa8a0a2.jpg"
          alt="Liên hệ VietTravel"
          width={1500}
          height={1000}
          className="w-full h-[40vh] sm:h-[45vh] md:h-[50vh] object-cover"
          priority
        />

        <div className="absolute inset-0 bg-foreground/55 flex flex-col items-center justify-center px-4">
          <h1 className="text-xl sm:text-2xl md:text-[40px] font-bold text-center text-white mb-4">
            Liên hệ với VietTravel
          </h1>
          <p className="text-center text-[12px] sm:text-[15px] md:text-[20px] font-light text-white/90 max-w-3xl">
            Bạn cần tư vấn tour, hỗ trợ đặt dịch vụ hoặc muốn hợp tác đăng bán
            gói du lịch với tư cách đại lý? VietTravel luôn sẵn sàng hỗ trợ.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="w-full flex justify-center items-center py-12 bg-section">
        <div className="w-[90%] md:w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-y-7 gap-x-9">
          {/* Thông tin liên hệ */}
          <div className="bg-card border border-border flex flex-col justify-center items-start p-5 sm:p-7 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Thông tin liên hệ
            </h2>

            <div className="space-y-2 text-sm sm:text-base text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground/90">
                  Địa chỉ:
                </span>{" "}
                96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội
              </p>
              <p>
                <span className="font-semibold text-foreground/90">
                  Điện thoại:
                </span>{" "}
                (+84) 024 3756 2186
              </p>
              <p>
                <span className="font-semibold text-foreground/90">Email:</span>{" "}
                support@viettravel.com
              </p>
              <p>
                <span className="font-semibold text-foreground/90">
                  Giờ làm việc:
                </span>{" "}
                Thứ 2 - Thứ 7 (8:00 - 17:30)
              </p>
            </div>
          </div>

          {/* Gửi tin nhắn */}
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
