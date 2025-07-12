import PostDetails from "../../../model/interface/forum/post/postDetails";
import PostMetaData from "./components/PostMetaData";
import { MdThumbUp, MdThumbDown } from "react-icons/md";
import { FaComment, FaShare } from "react-icons/fa";
import AddCommentButton from "../components/AddCommentButton";
import PostMenu from "./components/PostMenu";

interface DetailedPostProps {
    post: PostDetails;
}

const handleDelete = async (postId: number) => {};

export default function DetailedPost({ post }: DetailedPostProps) {
    return (
        <div className="dark:bg-darkBgSoft mx-auto mt-8 mb-4 max-w-3xl rounded-xl p-6">
            {/*górny pasek*/}
            <div className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-3">
                    <img
                        src={post?.author?.profilePhoto}
                        alt="profileImage"
                        className="h-12 w-12 cursor-pointer rounded-full"
                    />
                    <span className="cursor-pointer">
                        {post?.author?.username}
                    </span>
                </div>
                <span>{new Date(post?.publishDate).toLocaleDateString()}</span>
            </div>
            {/*kategorie i tagi*/}
            <div className="mt-4">
                <PostMetaData category={post?.category} tags={post?.tags} />
            </div>
            {/*zawartość posta*/}
            <div className="mt-4 text-lg">
                <span className="font-semibold">{post?.title}</span>
                <p
                    dangerouslySetInnerHTML={{ __html: post?.content }}
                    className="mt-2 break-words whitespace-pre-line"
                ></p>
            </div>
            {/*dolny pasek*/}
            <div className="flex items-center gap-12 text-2xl">
                <MdThumbUp className="cursor-pointer hover:text-blue-500" />
                <MdThumbDown className="cursor-pointer hover:text-blue-500" />
                <FaComment className="cursor-pointer hover:text-blue-500" />
                <FaShare className="cursor-pointer hover:text-blue-500" />
                <PostMenu
                    postId={post.id}
                    isUserAuthor={post.isAuthor}
                    onDelete={handleDelete}
                />
                <AddCommentButton />
            </div>
        </div>
    );
}
