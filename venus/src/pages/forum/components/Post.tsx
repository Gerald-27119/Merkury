import PostGeneral from "../../../model/interface/forum/post/PostGeneral";
import PostHeader from "./PostHeader";
import PostMetaData from "./PostMetaData";
import PostContent from "./PostContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationAction } from "../../../redux/notification";
import { deletePost } from "../../../http/posts";
import useDispatchTyped from "../../../hooks/useDispatchTyped";

interface PostProps {
  post: PostGeneral;
}

export default function Post({ post }: PostProps) {
  const queryClient = useQueryClient();
  const dispatch = useDispatchTyped();

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
        <PostHeader post={post} onDelete={handleDelete} />
        <PostMetaData category={post.category} tags={post.tags} />
        <PostContent
          content={post.content}
          views={post.views}
          numberOfComments={post.numberOfComments}
        />
      </div>
    </div>
  );
}
