import Image from "next/image";
import ContactForm from "@/components/customer/contact/ContactForm";

export default function ContactPage() {
  return (
    <>
      {/* Section 1: Header */}
      <section className="relative w-full overflow-hidden">
        <Image
          src="https://i.pinimg.com/1200x/c0/a9/0d/c0a90dbe753e3c327fae122fbaa8a0a2.jpg"
          alt="Khám phá Việt Nam"
          width={1500}
          height={1000}
          className="w-full h-[40vh] sm:h-[45vh] md:h-[50vh] object-cover"
        />
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
          <h1 className="text-xl sm:text-2xl md:text-[40px] font-bold text-center text-white mb-4">
            Liên hệ với VietTravel
          </h1>
          <p className="text-center text-[10px] sm:text-[15px] md:text-[20px] font-thin text-slate-100 mb-4">
            Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến, thắc mắc và hỗ trợ bạn
            trong quá trình lên kế hoạch cho chuyến đi tuyệt vời của mình.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="w-full flex justify-center items-center py-10">
        <div className="w-[90%] md:w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-y-7 gap-x-9">
          {/* Thông tin liên hệ */}
          <div className="bg-slate-100 flex flex-col justify-center items-start p-4 sm:p-7 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-7">
              Thông tin liên hệ
            </h2>
            <div>
              <p>
                <strong>Địa chỉ:</strong> 96A Đ. Trần Phú, P. Mộ Lao, Hà Đông,
                Hà Nội
              </p>
              <p>
                <strong>Điện thoại:</strong> (+84) 024 3756 2186
              </p>
              <p>
                <strong>Email:</strong> support@viettravel.com
              </p>
              <p>
                <strong>Giờ làm việc:</strong> Thứ 2 - Thứ 7 (8:00 - 17:30)
              </p>
            </div>
          </div>

          {/* Gửi tin nhắn */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
