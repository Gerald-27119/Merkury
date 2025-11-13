import TrendingPostDto from "../../../../model/interface/forum/trendingPostDto";

interface TrendingPostProps {
    post: TrendingPostDto;
}

export default function TrendingPost({ post }: TrendingPostProps) {
    return (
        <div className="dark:hover:bg-darkBgMuted hover:bg-lightBgDarker flex cursor-pointer flex-col rounded p-2 select-none">
            <div className="font-bold">{post.title}</div>
            <div className="mt-2 flex items-center gap-2 text-sm">
                <span>Author:</span>
                <img
                    src={post.author.profilePhoto}
                    alt="profileImage"
                    className="h-5 w-5 rounded-full"
                ></img>
                <span>{post.author.username}</span>
            </div>
            <div className="mt-1 text-sm">
                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
