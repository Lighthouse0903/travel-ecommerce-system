"use client";

import React from "react";
import { useParams } from "next/navigation";
import TourList from "@/components/customer/tours/TourList";

const SLUG_TO_CATEGORY = {
  "bien-dao": { code: "sea", label: "Biển đảo" },
  "nui-rung": { code: "mountain", label: "Núi rừng" },
  "nghi-duong": { code: "resort", label: "Nghỉ dưỡng" },
  "kham-pha": { code: "adventure", label: "Khám phá" },
  "van-hoa": { code: "cultural", label: "Văn hoá" },
  "lich-su": { code: "history", label: "Lịch sử" },
} as const;

type CategorySlug = keyof typeof SLUG_TO_CATEGORY;

const TourSlugPage: React.FC = () => {
  const params = useParams();
  const slugParam = params.slug as string;

  const category = SLUG_TO_CATEGORY[slugParam as CategorySlug] ?? null;

  if (!category) {
    return (
      <main className="w-full flex justify-center bg-slate-100 py-10">
        <div className="w-[90%] md:w-[80%]">
          <h1 className="text-2xl font-semibold mb-3">
            Không tìm thấy chủ đề tour phù hợp
          </h1>
          <p className="text-slate-600">
            Vui lòng kiểm tra lại đường dẫn hoặc quay về trang danh sách tour để
            tiếp tục tìm kiếm.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex justify-center bg-white">
      <div>
        <header className="mb-6 flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            Tour theo chủ đề: {category.label}
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            Khám phá các hành trình thuộc nhóm{" "}
            <span className="font-medium lowercase">{category.label}</span> được
            nhiều du khách yêu thích.
          </p>
        </header>

        <TourList initialCategory={category.code} />
      </div>
    </main>
  );
};

export default TourSlugPage;
