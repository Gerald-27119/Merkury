import TrendingPostDto from "../../../../model/interface/forum/trendingPostDto";
import { NavLink, useNavigate } from "react-router-dom";

interface TrendingPostProps {
    post: TrendingPostDto;
}

export default function TrendingPost({ post }: TrendingPostProps) {
    const navigate = useNavigate();

    const handleNavigateToAuthorProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/account/profile/${post.author.username}`);
    };

    return (
        <div className="dark:hover:bg-darkBgMuted hover:bg-lightBgDarker flex flex-col rounded p-2 select-none">
            <NavLink to={`/forum/${post.id}/${post.slugTitle}`}>
                <div className="cursor-pointer font-bold hover:underline">
                    {post.title}
                </div>
            </NavLink>
            <div className="mt-2 flex items-center gap-2 text-sm">
                <span>Author:</span>
                <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={handleNavigateToAuthorProfile}
                >
                    <img
                        src={post.author.profilePhoto}
                        alt="profileImage"
                        className="h-5 w-5 rounded-full"
                    ></img>
                    <span className="hover:underline">
                        {post.author.username}
                    </span>
                </div>
            </div>
            <div className="mt-1 text-sm">
                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
