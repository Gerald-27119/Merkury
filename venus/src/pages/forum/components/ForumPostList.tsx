import ForumSortDropdown from "./ForumSortDropdown";
import Post from "../posts/Post";
import React from "react";
import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import { PostSortOption } from "../../../model/enum/forum/postSortOption";

interface ForumPostListProps {
    posts?: PostGeneral[];
    sortOption: PostSortOption;
    onSortChange: (option: PostSortOption) => void;
}

export default function ForumPostList({
    posts,
    sortOption,
    onSortChange,
}: ForumPostListProps) {
    const options: PostSortOption[] = [
        { name: "Newest", sortBy: "PUBLISH_DATE", sortDirection: "DESC" },
        { name: "Oldest", sortBy: "PUBLISH_DATE", sortDirection: "ASC" },
        { name: "Most Viewed", sortBy: "VIEWS", sortDirection: "DESC" },
        { name: "Least Viewed", sortBy: "VIEWS", sortDirection: "ASC" },
        { name: "Most Commented", sortBy: "COMMENTS", sortDirection: "DESC" },
        { name: "Least Commented", sortBy: "COMMENTS", sortDirection: "ASC" },
    ];

    return (
        <div>
            <ForumSortDropdown
                options={options}
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
        </div>
    );
}
