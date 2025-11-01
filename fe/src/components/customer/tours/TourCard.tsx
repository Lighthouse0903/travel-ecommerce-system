import { Tour } from "@/types/tour";
import Image from "next/image";
import React from "react";
interface TourCardProps {
  tour: Tour;
}

const TourCard = ({ tour }: TourCardProps) => {
  return (
    <div className="w-full rounded-xl bg-slate-100 flex flex-col md:flex-row shadow-md hover:shadow-lg transition gap-3 p-3 ">
      <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-bl-md rounded-tl-md overflow-hidden ">
        <Image
          src={tour.thumbnail}
          alt={tour.title}
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg md:text-xl line-clamp-2">
            {tour.title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{tour.duration}</p>
          <p className="text-sm text-slate-600">
            {tour.region} - {tour.category}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-red-600 font-bold">
              {tour.price.toLocaleString()}₫
            </span>
            <span className="ml-2 line-through text-gray-400">
              {tour.discountPrice.toLocaleString()}₫
            </span>
          </div>

          <div className="text-sm flex items-center gap-1">
            ⭐<span>{tour.rating}</span> ({tour.reviewsCount})
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
