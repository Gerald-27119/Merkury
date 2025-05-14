import PostMenu from "./PostMenu";
import PostGeneral from "../../../model/interface/forum/post/PostGeneral";

interface PostHeaderProps {
  post: PostGeneral;
  onDelete: (postId: number) => void;
}

export default function PortHeader({ post, onDelete }: PostHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <h2 className="dark:hover:text-lightBgSoft cursor-pointer text-xl font-bold">
        {post.title}
      </h2>
      <PostMenu post={post} onDelete={onDelete} />
    </div>
  );
}
