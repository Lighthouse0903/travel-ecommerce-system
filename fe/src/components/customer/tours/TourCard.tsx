import Image from "next/image";
import StarRating from "@/components/common/rating/StarRating";
import { TourListPageType, CATEGORY_MAP } from "@/types/tour";
import Link from "next/link";

const TourCard: React.FC<TourListPageType> = ({
  tour_id,
  image_url,
  duration_days,
  destination,
  name,
  categories,
  adult_price,
  children_price,
  discount,
  rating,
  reviews_count,
}) => {
  const adultPriceNumber = Number(adult_price) || 0;
  const discountNumber = Number(discount) || 0;

  const finalPrice =
    discountNumber > 0
      ? adultPriceNumber * (1 - discountNumber / 100)
      : adultPriceNumber;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer">
      {/* Thumbnail */}
      <div className="relative h-40 sm:h-44 md:h-52">
        <Image src={image_url} alt={name} fill className="object-cover" />

        {discountNumber > 0 && (
          <div className="absolute w-9 h-9 sm:w-10 sm:h-10 top-2 left-2 sm:top-3 sm:left-3 rounded-full bg-red-500 text-white flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-semibold">
              -{discountNumber}%
            </span>
          </div>
        )}

        <div className="absolute bottom-2 left-2 rounded-full bg-black/60 text-white text-[10px] sm:text-xs px-2 py-1">
          {duration_days} ngày {duration_days - 1} đêm
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-2">
        {/* Tên tour */}
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 line-clamp-2 mb-1">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center text-[11px] sm:text-xs md:text-sm gap-1">
          <StarRating stars={rating} />
          <span className="text-[11px] sm:text-xs text-slate-500">
            ({reviews_count} đánh giá)
          </span>
        </div>

        {/* Destination */}
        <p className="text-[11px] sm:text-xs md:text-sm text-slate-500">
          {destination}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1">
          {categories.map((category) => (
            <span
              key={category}
              className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
            >
              {CATEGORY_MAP[category] ?? category}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between mt-2">
          <div>
            <p className="text-[11px] sm:text-xs text-slate-500">Giá từ</p>
            <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600">
              {finalPrice.toLocaleString("vi-VN")} đ
            </p>
            {discountNumber > 0 && (
              <p className="text-xs sm:text-sm text-gray-400 line-through">
                {adultPriceNumber.toLocaleString("vi-VN")} đ
              </p>
            )}
          </div>

          <Link href={`/tour/${tour_id}`}>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-800 text-[11px] sm:text-xs md:text-sm text-white hover:bg-slate-700 transition">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
