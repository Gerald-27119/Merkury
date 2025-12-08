import ForumSortDropdown from "./ForumSortDropdown";
import Post from "../posts/Post";
import React from "react";
import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import { PostSortOption } from "../../../model/enum/forum/postSortOption";
import SearchResults from "../post-search/SearchResults";
import { PostSearchRequestDto } from "../../../model/interface/forum/post/postSearchRequestDto";

interface ForumPostListProps {
    posts?: PostGeneral[];
    sortOption: PostSortOption;
    onSortChange: (option: PostSortOption) => void;
    searchFilters?: PostSearchRequestDto;
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
    searchFilters = {},
    totalSearchResults,
}: ForumPostListProps) {
    const {
        searchPhrase = "",
        category = "",
        tags = [],
        fromDate = "",
        toDate = "",
        author = "",
    } = searchFilters;

    const hasFilters =
        searchPhrase ||
        category ||
        tags.length > 0 ||
        fromDate ||
        toDate ||
        author;

    return (
        <div>
            <ForumSortDropdown
                options={options}
                onSortChange={onSortChange}
                selected={sortOption}
                disabled={!posts?.length || posts.length <= 1}
            />

            {hasFilters && (
                <SearchResults
                    data={totalSearchResults}
                    filters={searchFilters}
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
                <div className="mt-2 flex w-md items-center justify-center p-2 text-lg md:w-2xl">
                    <span>No results found</span>
                </div>
            )}
        </div>
    );
}
