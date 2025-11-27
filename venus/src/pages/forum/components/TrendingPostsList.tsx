import TrendingPostDto from "../../../model/interface/forum/trendingPostDto";
import TrendingPost from "../posts/components/TrendingPost";

interface TrendingPostsListProps {
    posts?: TrendingPostDto[];
}

export default function TrendingPostsList({ posts }: TrendingPostsListProps) {
    return (
        <div className="p-4">
            <span>Trending Posts</span>
            {posts?.length ? (
                <div className="mt-2">
                    <ul className="space-y-2">
                        {posts.map((post, index) => (
                            <li key={post.id}>
                                <TrendingPost post={post} />

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
