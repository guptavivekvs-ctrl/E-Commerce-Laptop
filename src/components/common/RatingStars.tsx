import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: string;
  showNumber?: boolean;
  reviewCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 'w-4 h-4',
  showNumber = false,
  reviewCount,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4 && rating % 1 <= 0.8;
  const emptyStars = Math.max(0, max - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="flex items-center gap-1.5 text-amber-400">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${size} fill-amber-400 text-amber-400`} />
        ))}
        {hasHalfStar && <StarHalf className={`${size} fill-amber-400 text-amber-400`} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${size} text-zinc-600`} />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-zinc-300 ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-zinc-500 font-normal ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
