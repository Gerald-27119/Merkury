import ForumSortDropdown from "./ForumSortDropdown";
import Post from "../posts/Post";
import React from "react";
import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import { PostSortOption } from "../../../model/enum/forum/postSortOption";
import SearchResults from "../post-search/SearchResults";

interface ForumPostListProps {
    posts?: PostGeneral[];
    sortOption: PostSortOption;
    onSortChange: (option: PostSortOption) => void;
    searchPhrase?: string;
    totalSearchResults?: number;
}

const options: PostSortOption[] = [
    { name: "Newest", sortBy: "PUBLISH_DATE", sortDirection: "DESC" },
    { name: "Oldest", sortBy: "PUBLISH_DATE", sortDirection: "ASC" },
    { name: "Most Viewed", sortBy: "VIEWS", sortDirection: "DESC" },
    { name: "Least Viewed", sortBy: "VIEWS", sortDirection: "ASC" },
    { name: "Most Commented", sortBy: "COMMENTS", sortDirection: "DESC" },
    { name: "Least Commented", sortBy: "COMMENTS", sortDirection: "ASC" },
];

export default function ForumPostList({
    posts,
    sortOption,
    onSortChange,
    searchPhrase,
    totalSearchResults,
}: ForumPostListProps) {
    return (
        <div>
            <ForumSortDropdown
                options={options}
                onSortChange={onSortChange}
                selected={sortOption}
                disabled={!posts?.length || posts.length <= 1}
            />

            {searchPhrase && (
                <SearchResults
                    data={totalSearchResults}
                    searchPhrase={searchPhrase}
                />
            )}

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
                <div className="mt-2 flex items-center justify-center p-2 text-lg">
                    <span>No posts available</span>
                </div>
            )}
        </div>
    );
}
