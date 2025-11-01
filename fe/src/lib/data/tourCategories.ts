// src/data/tourCategories.ts

export interface TourCategory {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export const TOUR_CATEGORIES: TourCategory[] = [
  {
    id: 1,
    name: "Nghỉ dưỡng",
    icon: "🌴",
    description: "Thư giãn tại biển, resort hoặc suối nước nóng.",
  },
  {
    id: 2,
    name: "Khám phá - Phiêu lưu",
    icon: "⛰️",
    description: "Trekking, leo núi, phượt, khám phá hang động, chèo kayak.",
  },
  {
    id: 3,
    name: "Văn hóa - Lịch sử",
    icon: "🏯",
    description:
      "Tham quan di tích, lễ hội, làng nghề truyền thống, chùa chiền.",
  },
  {
    id: 4,
    name: "Biển đảo",
    icon: "🏖️",
    description: "Khám phá các đảo, lặn biển, nghỉ dưỡng tại vùng biển đẹp.",
  },
  {
    id: 5,
    name: "Ẩm thực",
    icon: "🍜",
    description: "Trải nghiệm đặc sản vùng miền, tham quan chợ, lớp nấu ăn.",
  },
  {
    id: 6,
    name: "Sinh thái - Thiên nhiên",
    icon: "🌳",
    description: "Tham quan rừng, vườn quốc gia, du lịch cộng đồng xanh.",
  },
  {
    id: 7,
    name: "Gia đình",
    icon: "👨‍👩‍👧‍👦",
    description:
      "Hoạt động phù hợp cho trẻ em, người lớn tuổi, vui chơi nhẹ nhàng.",
  },
  {
    id: 8,
    name: "Trăng mật - Cặp đôi",
    icon: "💞",
    description: "Không gian lãng mạn, riêng tư, phù hợp cho các cặp đôi.",
  },
  {
    id: 9,
    name: "Team building - Công ty",
    icon: "🤝",
    description: "Du lịch kết hợp hoạt động nhóm, hội thảo, sự kiện công ty.",
  },
  {
    id: 10,
    name: "Hành hương - Tâm linh",
    icon: "🛕",
    description: "Chiêm bái, tham quan chùa chiền, đền thờ linh thiêng.",
  },
];
