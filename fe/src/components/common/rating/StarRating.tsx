import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  stars: number;
}

const StarRating: React.FC<StarRatingProps> = ({ stars }) => {
  const totalStars = 5;

  return (
    <div className="flex items-center">
      {Array.from({ length: totalStars }).map((_, i) =>
        i < stars ? (
          <Star key={i} className="ml-1 text-yellow-500" size={15} />
        ) : (
          <Star key={i} className="ml-1 text-gray-500" size={15} />
        )
      )}
    </div>
  );
};

export default StarRating;
