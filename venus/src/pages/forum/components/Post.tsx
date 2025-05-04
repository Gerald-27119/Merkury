import { HiDotsHorizontal, HiEye } from "react-icons/hi";
import { MdMessage } from "react-icons/md";
import PostGeneral from "../../../model/interface/forum/post/PostGeneral";

interface PostProps {
  post: PostGeneral;
}

export default function Post({ post }: PostProps) {
  return (
    <div className="dark:bg-darkBgSoft mx-auto my-4 max-w-md overflow-hidden rounded-xl shadow-md md:max-w-2xl">
      <div className="p-6">
        {/* Title and DotsHorizontal */}
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <HiDotsHorizontal className="text-xl" />
        </div>

        {/* Content */}
        <div className="mt-4 flex justify-between">
          {/* Post content on the left */}
          <p className="whitespace-pre-line">{post.content}</p>

          {/* Views and Comments on the right */}
          <div className="ml-2 flex flex-row items-end space-x-2">
            <div className="flex flex-col items-center space-y-3 text-lg">
              <MdMessage />
              <HiEye />
            </div>
            <div className="flex flex-col items-center space-y-3 text-lg">
              <span className="align-middle leading-none">
                {post.numberOfComments}
              </span>
              <span className="align-middle leading-none">{post.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
