import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const AboutUs = () => {
  const staffs = [
    {
      id: 1,
      name: "Nguyễn Hải Đăng",
      position: "CEO - Giám đốc điều hành",
      image:
        "https://i.pinimg.com/736x/13/3c/36/133c3695957e4bc8384f0d6dfcbb7238.jpg",
      bio: "Định hướng chiến lược phát triển nền tảng, tập trung vào trải nghiệm khách hàng, tính minh bạch và chuẩn dịch vụ cho các đại lý đối tác.",
      socials: { facebook: "#", instagram: "#", linkedin: "#" },
    },
    {
      id: 2,
      name: "Phạm Văn Anh",
      position: "Trưởng phòng phát triển sản phẩm",
      image:
        "https://i.pinimg.com/736x/4f/8f/33/4f8f33726bf9235121d00578eeee2ed0.jpg",
      bio: "Xây dựng danh mục tour linh hoạt, tối ưu giá và ưu đãi để khách dễ chọn – đại lý dễ bán.",
      socials: { facebook: "#", instagram: "#", linkedin: "#" },
    },
    {
      id: 3,
      name: "Lại Trung Lâm",
      position: "Giám đốc vận hành tour",
      image:
        "https://i.pinimg.com/736x/c9/e6/e9/c9e6e9b794ec82e4393e541e17d36696.jpg",
      bio: "Đảm bảo quy trình vận hành, tiêu chuẩn chất lượng và hỗ trợ xử lý phát sinh để mỗi chuyến đi trọn vẹn.",
      socials: { facebook: "#", instagram: "#", linkedin: "#" },
    },
    {
      id: 4,
      name: "GPT",
      position: "Trợ lý công nghệ & trí tuệ nhân tạo",
      image:
        "https://i.pinimg.com/1200x/b3/3f/0d/b33f0d10bab5c0d68a006844f7eda264.jpg",
      bio: "Hỗ trợ tư vấn nhanh, gợi ý hành trình phù hợp và giải đáp 24/7 để khách đặt tour thuận tiện hơn.",
      socials: { facebook: "#", instagram: "#", linkedin: "#" },
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Section 1: Header */}
      <section className="relative w-full overflow-hidden">
        <Image
          src="https://i.pinimg.com/1200x/53/9a/35/539a35c22fe26f5841a17c7b5d82ea2a.jpg"
          alt="Khám phá Việt Nam"
          width={1500}
          height={1000}
          className="w-full h-[40vh] sm:h-[45vh] md:h-[50vh] object-cover"
          priority
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-foreground/55 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center w-[90vw] md:w-[80vw] h-auto px-4">
            <h1 className="text-xl sm:text-2xl md:text-[40px] font-bold text-center text-white mb-4">
              VietTravel – Nền tảng đặt tour & gói du lịch từ các đại lý uy tín
            </h1>

            <p className="text-center text-[12px] sm:text-[15px] md:text-[20px] font-light text-white/90 mb-4">
              Chúng tôi kết nối đại lý du lịch với khách hàng một cách minh bạch
              và tiện lợi: dễ tìm tour, dễ so sánh, dễ đặt – và luôn có đội ngũ
              hỗ trợ đồng hành trước, trong và sau chuyến đi.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Hành trình phát triển */}
      <section className="w-full flex justify-center items-center py-12 bg-section">
        <div className="w-[90%] md:w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <div className="flex justify-center items-center overflow-hidden">
              <Image
                src="https://i.pinimg.com/1200x/3d/55/72/3d557247b5be6af7f40aebed3ad30566.jpg"
                alt="Hành trình phát triển"
                width={1200}
                height={900}
                className="w-full h-auto object-cover rounded-2xl border border-border"
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-start justify-center">
            <h2 className="text-2xl font-semibold text-foreground mb-5">
              Hành trình phát triển
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-3">
              VietTravel được xây dựng với mục tiêu trở thành “sàn tour” đáng
              tin cậy: nơi các đại lý có thể đăng bán tour/gói du lịch, còn
              khách hàng dễ dàng tìm kiếm và đặt dịch vụ phù hợp.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-3">
              Chúng tôi tập trung chuẩn hóa thông tin tour, minh bạch chính
              sách, và tối ưu trải nghiệm đặt tour – để mỗi lựa chọn đều rõ ràng
              và an tâm.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Trong thời gian tới, VietTravel tiếp tục mở rộng hệ thống đối tác,
              nâng cao công nghệ và chất lượng hỗ trợ để đồng hành cùng mọi hành
              trình.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Sứ mệnh */}
      <section className="w-full flex justify-center items-center py-12 bg-background">
        <div className="w-[90%] md:w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full flex flex-col items-start justify-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Sứ mệnh của chúng tôi
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-3">
              VietTravel hướng tới việc giúp khách hàng đặt tour nhanh hơn, đúng
              nhu cầu hơn, đồng thời giúp đại lý tối ưu việc giới thiệu và bán
              gói du lịch hiệu quả.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-3">
              Chúng tôi coi trọng sự minh bạch, an toàn và chất lượng dịch vụ.
              Mỗi tour đăng tải đều cần thông tin rõ ràng, chính sách dễ hiểu và
              hỗ trợ kịp thời.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              VietTravel mong muốn trở thành người bạn đồng hành tin cậy – nơi
              mỗi chuyến đi là một trải nghiệm đáng nhớ, và mỗi đại lý đều có cơ
              hội phát triển bền vững.
            </p>
          </div>

          <div className="w-full">
            <div className="flex justify-center items-center overflow-hidden">
              <Image
                src="https://i.pinimg.com/1200x/76/53/b0/7653b06a19168b01392a6d87a83fa488.jpg"
                alt="Sứ mệnh"
                width={1200}
                height={900}
                className="w-full h-auto object-cover rounded-2xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Đội ngũ */}
      <section className="w-full flex justify-center items-center py-12 bg-section">
        <div className="w-[90%] md:w-[80%]">
          <p className="text-center text-2xl md:text-3xl mb-8 font-semibold text-foreground">
            Đội ngũ của chúng tôi
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {staffs.map((staff) => (
              <div
                key={staff.id}
                className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border border-border ring-2 ring-ring/15 ring-offset-2 ring-offset-background">
                  <Image
                    src={staff.image}
                    alt={staff.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>

                <h3 className="text-lg font-semibold text-foreground">
                  {staff.name}
                </h3>

                <p className="text-sm text-muted-foreground font-medium">
                  {staff.position}
                </p>

                <p className="text-muted-foreground text-sm mt-2">
                  {staff.bio}
                </p>

                {/* Social */}
                <div className="flex gap-3 mt-4 text-muted-foreground">
                  <a href={staff.socials.facebook} target="_blank">
                    <Facebook className="w-5 h-5 hover:text-primary transition-colors" />
                  </a>
                  <a href={staff.socials.instagram} target="_blank">
                    <Instagram className="w-5 h-5 hover:text-primary transition-colors" />
                  </a>
                  <a href={staff.socials.linkedin} target="_blank">
                    <Linkedin className="w-5 h-5 hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
