import { IoStarHalf } from "react-icons/io5";
import { IoStar } from "react-icons/io5";
import { IoIosStarOutline } from "react-icons/io";

export default function Comment({ comment }) {
  const calculateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars > 0;
    let stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<IoStarHalf className="text-yellow-400" />);
    }

    if (stars.length < 5) {
      const starsToAdd = 5 - stars.length;
      for (let i = 0; i < starsToAdd; i++) {
        stars.push(<IoIosStarOutline />);
      }
    }

    return stars;
  };

  return (
    <div className="border border-stone-400 rounded-sm m-1 p-1">
      <div className="flex mb-1">
        <div className="w-full">
          <div className="text-xs">{comment.publishDate}</div>
          <div className="text-base">{comment.author}</div>
        </div>
        <div className="inline-flex">{calculateStars(comment.rating)}</div>
      </div>
      <div>{comment.text}</div>
    </div>
  );
}
