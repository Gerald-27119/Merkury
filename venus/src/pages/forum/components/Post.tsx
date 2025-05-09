import { HiEye } from "react-icons/hi";
import { MdMessage } from "react-icons/md";
import PostGeneral from "../../../model/interface/forum/post/PostGeneral";
import Tag from "./Tag";
import Category from "./Category";
import PostMenu from "./PostMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationAction } from "../../../redux/notification";
import { deletePost } from "../../../http/posts";
import { useDispatch } from "react-redux";

interface PostProps {
  post: PostGeneral;
}

export default function Post({ post }: PostProps) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutateAsync: mutateDelete } = useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      dispatch(
        notificationAction.setSuccess({
          message: "Post deleted successfully!",
        }),
      );
    },
    onError: () => {
      dispatch(
        notificationAction.setError({
          message: "Failed to delete post. Please try again later.",
        }),
      );
    },
  });

  const handleDelete = async (postId: number) => {
    await mutateDelete(postId);
  };

  return (
    <div className="dark:bg-darkBgSoft mx-auto my-4 max-w-md rounded-xl shadow-md md:max-w-2xl">
      <div className="p-6">
        {/* Title and DotsHorizontal */}
        <div className="flex items-start justify-between">
          <h2 className="dark:hover:text-lightBgSoft cursor-pointer text-xl font-bold">
            {post.title}
          </h2>
          <PostMenu post={post} onDelete={handleDelete} />
        </div>

        {/*Category and Tags*/}
        {post.category && (
          <div className="mt-2 flex flex-wrap gap-2">
            <Category category={post.category} />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mt-2 flex justify-between">
          {/* Post content on the left */}
          <p className="dark:hover:text-lightBgSoft cursor-pointer break-words whitespace-pre-line">
            {post.content}
          </p>

          {/* Views and Comments on the right */}
          <div className="ml-8 flex flex-row items-end space-x-2">
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
