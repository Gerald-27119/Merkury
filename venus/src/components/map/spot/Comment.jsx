import { IoStarHalf } from "react-icons/io5";
import { IoStar } from "react-icons/io5";

export default function Comment({ comment }) {
  return (
    <div className="border border-stone-400 rounded-sm m-1 p-1">
      <div className="flex mb-1">
        <div className="w-full">
          <div className="text-xs">{comment.publishDate}</div>
          <div className="text-base">{comment.author}</div>
        </div>
        <div className="inline-flex">
          {/*{comment.rating}*/}
          <IoStar />
          <IoStar />
          <IoStar />
          <IoStar />
          <IoStarHalf />
        </div>
      </div>
      <div>{comment.text}</div>
    </div>
  );
}
