import { formatPublishDate } from "../../../../utils/spot-utils.jsx";
import { Rate } from "antd";

export default function Comment({ comment }) {
  return (
    <div className="border border-stone-400 rounded-sm m-1 p-1">
      <div className="flex mb-1 justify-between">
        <div className="w-1/2   ">
          <p className="text-xs">{formatPublishDate(comment.publishDate)}</p>
          <p className="text-base">{comment.author}</p>
        </div>
        <div className="inline-flex">
          <Rate
            disabled
            allowHalf
            className="text-xs"
            defaultValue={comment.rating}
          />
        </div>
      </div>
      <div>
        <p>{comment.text}</p>
      </div>
    </div>
  );
}
