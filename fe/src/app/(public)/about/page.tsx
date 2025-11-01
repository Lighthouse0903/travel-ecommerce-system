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
      bio: "Với hơn 12 năm kinh nghiệm trong ngành du lịch, anh Đăng là người dẫn dắt tầm nhìn chiến lược, hướng đến trải nghiệm khách hàng hoàn hảo và dịch vụ chuyên nghiệp.",
      socials: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      id: 2,
      name: "Phạm Văn Anh",
      position: "Trưởng phòng phát triển sản phẩm",
      image:
        "https://i.pinimg.com/736x/4f/8f/33/4f8f33726bf9235121d00578eeee2ed0.jpg",
      bio: "Chuyên phụ trách xây dựng các gói tour độc đáo và linh hoạt. Anh luôn mang đến những hành trình sáng tạo, kết hợp giữa khám phá và trải nghiệm văn hóa bản địa.",
      socials: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      id: 3,
      name: "Lại Trung Lâm",
      position: "Giám đốc điều hành tour",
      image:
        "https://i.pinimg.com/736x/c9/e6/e9/c9e6e9b794ec82e4393e541e17d36696.jpg",
      bio: "Với phong cách làm việc tận tâm và tỉ mỉ, anh Lâm chịu trách nhiệm tổ chức, điều phối tour và đảm bảo mọi chi tiết vận hành trơn tru.",
      socials: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      id: 4,
      name: "GPT",
      position: "Trợ lý công nghệ & trí tuệ nhân tạo",
      image:
        "https://i.pinimg.com/1200x/b3/3f/0d/b33f0d10bab5c0d68a006844f7eda264.jpg",
      bio: "GPT phụ trách phát triển các giải pháp tự động hóa và hỗ trợ khách hàng bằng công nghệ AI, mang lại trải nghiệm nhanh chóng và chính xác cho mọi người dùng.",
      socials: {
        facebook: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
  ];

  return (
    <>
      {/* Section 1: Header */}
      <section className="relative w-full overflow-hidden">
        <Image
          src="https://i.pinimg.com/1200x/53/9a/35/539a35c22fe26f5841a17c7b5d82ea2a.jpg"
          alt="Khám phá Việt Nam"
          width={1500}
          height={1000}
          className="w-full h-[40vh] sm:h-[45vh] md:h-[50vh] object-cover"
        />
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center marker">
          <div className="flex flex-col items-center justify-between w-[90vw] md:w-[80vw] h-auto px-4">
            <h1 className="text-xl sm:text-2xl md:text-[40px] font-bold text-center text-white mb-4">
              Giới thiệu về VietTravel
            </h1>
            <p className="text-center text-[10px] sm:text-[15px] md:text-[20px] font-thin text-slate-100 mb-4">
              VietTravel tự hào là công ty lữ hành hàng đầu tại Việt Nam, mang
              đến những hành trình du lịch chất lượng, an toàn và tràn đầy cảm
              xúc cho khách hàng trong và ngoài nước.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Hành trình phát triền */}
      <section className="w-full flex justify-center items-center py-10">
        <div className="w-[90%] md:w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-y-1 gap-x-0">
          <div className="w-full">
            <div className="flex justify-center items-center overflow-hidden py-4">
              <Image
                src={
                  "https://i.pinimg.com/1200x/3d/55/72/3d557247b5be6af7f40aebed3ad30566.jpg"
                }
                alt="ảnh"
                width={1200}
                height={900}
                className="w-[95%] h-auto object-contain rounded-xl"
              />
            </div>
          </div>
          <div className="w-full flex flex-col items-start justify-center px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-7">
              Hành trình phát triển
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Được thành lập vào năm 2024, VietTravel tuy là một cái tên mới
              trong lĩnh vực du lịch nhưng đã nhanh chóng khẳng định vị thế của
              mình nhờ chất lượng dịch vụ tận tâm và trải nghiệm khác biệt dành
              cho khách hàng.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              Chỉ sau một năm hoạt động, chúng tôi tự hào đã mở rộng 3 chi nhánh
              trên toàn quốc, mang đến cho du khách những hành trình trọn vẹn,
              an toàn và đầy cảm xúc.
            </p>
            <p className="text-gray-600 leading-relaxed">
              VietTravel cam kết tiếp tục nỗ lực không ngừng để trở thành người
              bạn đồng hành tin cậy trên mọi chuyến đi của bạn.
            </p>
          </div>
        </div>
      </section>
      {/* Section 3: Sứ mệnh của chúng tôi */}
      <section className="w-full flex justify-center items-center py-10">
        <div className="w-[90%] md:w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-y-1 gap-x-0">
          <div className="w-full flex flex-col items-start justify-center px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Tại VietTravel, chúng tôi luôn hướng đến mục tiêu mang lại những
              trải nghiệm du lịch tuyệt vời nhất cho mọi khách hàng. Mỗi chuyến
              đi không chỉ là hành trình khám phá những vùng đất mới, mà còn là
              hành trình của cảm xúc, sự sẻ chia và kết nối giữa con người với
              con người.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              Chúng tôi tin rằng du lịch không đơn thuần là việc di chuyển, mà
              là cơ hội để sống chậm lại, để cảm nhận, để yêu hơn từng khoảnh
              khắc trong cuộc sống. Chính vì thế, VietTravel luôn đặt chất lượng
              dịch vụ, sự an toàn và sự hài lòng của khách hàng lên hàng đầu.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Với đội ngũ nhân viên tận tâm, chuyên nghiệp và sáng tạo, chúng
              tôi không ngừng nỗ lực mang đến những chuyến đi trọn vẹn – nơi mỗi
              điểm đến là một câu chuyện đáng nhớ, và mỗi hành trình là một
              nguồn cảm hứng mới để bạn thêm yêu cuộc sống.
            </p>
          </div>
          <div className="w-full">
            <div className="flex justify-center items-center overflow-hidden py-4">
              <Image
                src={
                  "https://i.pinimg.com/1200x/76/53/b0/7653b06a19168b01392a6d87a83fa488.jpg"
                }
                alt="ảnh"
                width={1200}
                height={900}
                className="w-[95%] h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Đội ngũ của chúng tôi */}
      <section className="w-full flex justify-center items-center py-10">
        <div className="w-[90%] md:w-[80%]">
          <p className="text-center text-2xl md:text-3xl mb-6 font-semibold">
            Đội ngũ của chúng tôi
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-1 gap-x-0">
            {staffs.map((staff) => (
              <div
                key={staff.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col items-center text-center"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-slate-200">
                  <Image
                    src={staff.image}
                    alt={staff.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {staff.name}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {staff.position}
                </p>
                <p className="text-gray-600 text-sm mt-2">{staff.bio}</p>

                {/* Mạng xã hội */}
                <div className="flex gap-3 mt-4 text-gray-500">
                  <a href={staff.socials.facebook} target="_blank">
                    <Facebook className="w-5 h-5 hover:text-blue-600 transition" />
                  </a>
                  <a href={staff.socials.instagram} target="_blank">
                    <Instagram className="w-5 h-5 hover:text-pink-500 transition" />
                  </a>
                  <a href={staff.socials.linkedin} target="_blank">
                    <Linkedin className="w-5 h-5 hover:text-blue-700 transition" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default AboutUs;
