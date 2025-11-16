import Image from "next/image";
import { Tag } from "lucide-react";
import StarRating from "@/components/common/rating/StarRating";
import { TourListPageType } from "@/types/tour";
import { CATEGORY_MAP } from "@/types/tour";

const TourCard: React.FC<TourListPageType> = ({
  image_url,
  duration_days,
  destination,
  name,
  categories,
  adult_price,
  children_price,
  discount,
  rating,
  review_count,
}) => {
  const cleanPrice = Number(adult_price);

  const final_price = cleanPrice * (1 - Number(discount) / 100);
  // console.log("Giá cuối 1: ", final_price);
  adult_price = Number(adult_price);
  discount = Number(discount);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer">
      {/* Thumbnail */}
      <div className="relative h-44 sm:h-48">
        <Image src={image_url} alt={name} fill className="object-cover" />

        <div className="absolute w-10 h-10 top-3 left-3 rounded-full bg-red-500 text-white flex items-center justify-center">
          <span className="text-xs font-semibold">-{discount}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 mb-3 truncate">
          {name}
        </h3>
        {/* rating */}

        <div className="flex items-center text-sm">
          <StarRating stars={rating} /> ({review_count} đánh giá)
        </div>
        <hr className="my-2" />
        <p className="text-xs text-slate-500 mb-1">{destination}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <span
              key={category}
              className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
            >
              {CATEGORY_MAP[category] ?? category}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-slate-500">Giá từ</p>
            <p className="text-lg font-bold text-blue-600">
              {final_price.toLocaleString("vi-VN")} đ
            </p>
            <p className="text-md font-thin text-gray-400 line-through">
              {adult_price.toLocaleString("vi-VN")} đ
            </p>
          </div>

          <button className="px-4 py-2 rounded-full bg-slate-800 text-white text-xs hover:bg-slate-700 transition">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
