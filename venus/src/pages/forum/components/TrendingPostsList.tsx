import TrendingPostDto from "../../../model/interface/forum/trendingPostDto";
import { NavLink } from "react-router-dom";
import TrendingPost from "../posts/components/TrendingPost";

interface TrendingPostsListProps {
    posts?: TrendingPostDto[];
}

export default function TrendingPostsList({ posts }: TrendingPostsListProps) {
    return (
        <div className="p-4">
            <span className="">Trending Posts</span>
            {posts?.length ? (
                <div className="mt-2">
                    <ul className="space-y-2">
                        {posts.map((post, index) => (
                            <li key={post.id}>
                                <NavLink
                                    to={`/forum/${post.id}/${post.slugTitle}`}
                                >
                                    <TrendingPost post={post} />
                                </NavLink>

                                {index !== posts.length - 1 && (
                                    <div className="dark:bg-darkText bg-lightText my-2 h-[1px]" />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <span className="flex items-center">No posts found</span>
            )}
        </div>
    );
}
