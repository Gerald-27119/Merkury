import { calculateStars } from "../../../utils/spot-utils.jsx";

export default function Comment({ comment }) {
  return (
    <div className="border border-stone-400 rounded-sm m-1 p-1">
      <div className="flex mb-1">
        <div className="w-full">
          <p className="text-xs">{comment.publishDate}</p>
          <p className="text-base">{comment.author}</p>
        </div>
        <div className="inline-flex">{calculateStars(comment.rating)}</div>
      </div>
      <div>{comment.text}</div>
    </div>
  );
}
