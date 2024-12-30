import { IoStar, IoStarHalf } from "react-icons/io5";
import { IoIosStarOutline } from "react-icons/io";

export function calculateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars > 0;
  let stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<IoStar key={`full-${i}`} className="text-yellow-400" />);
  }
  if (hasHalfStar) {
    stars.push(<IoStarHalf key="half" className="text-yellow-400" />);
  }

  if (stars.length < 5) {
    const starsToAdd = 5 - stars.length;
    for (let i = 0; i < starsToAdd; i++) {
      stars.push(<IoIosStarOutline key={`empty-${i}`} />);
    }
  }

  return stars;
}
