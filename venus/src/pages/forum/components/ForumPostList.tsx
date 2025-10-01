import ForumPostSortDropdown from "./ForumPostSortDropdown";
import Post from "../posts/Post";
import React from "react";
import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import { ForumPostSortOption } from "../../../model/enum/forum/forumPostSortOption";

interface ForumPostListProps {
    posts?: PostGeneral[];
    sortOption: ForumPostSortOption;
    onSortChange: (option: ForumPostSortOption) => void;
}

export default function ForumPostList({
    posts,
    sortOption,
    onSortChange,
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
        </div>
    );
}
