import ForumPostSortDropdown from "./ForumPostSortDropdown";
import Post from "../posts/Post";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import React from "react";
import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import { ForumPostSortOption } from "../../../model/enum/forum/forumPostSortOption";

interface ForumPostListProps {
    posts?: PostGeneral[];
    sortOption: ForumPostSortOption;
    onSortChange: (option: ForumPostSortOption) => void;
    loadMoreRef: React.RefObject<HTMLDivElement>;
    isFetchingNextPage: boolean;
    hasNextPage?: boolean;
}

export default function ForumPostList({
    posts,
    sortOption,
    onSortChange,
    loadMoreRef,
    isFetchingNextPage,
    hasNextPage,
}: ForumPostListProps) {
    return (
        <div>
            <ForumPostSortDropdown
                onSortChange={onSortChange}
                selected={sortOption}
            />

            {posts?.length ? (
                <div>
                    <ul>
                        {posts.map((post) => (
                            <li key={post.id}>
                                <Post post={post} />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <span>No posts available</span>
            )}
            <div ref={loadMoreRef} className="flex items-center justify-center">
                {isFetchingNextPage && <LoadingSpinner />}
                {!hasNextPage && (
                    <p className="pb-4 font-bold">
                        Congratulations! You've reached the end!
                    </p>
                )}
            </div>
        </div>
    );
}
