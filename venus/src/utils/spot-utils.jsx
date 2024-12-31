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

export function formatPublishDate(publishDate) {
  const date = new Date(publishDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
