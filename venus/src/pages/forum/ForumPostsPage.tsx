import PostGeneral from "../../model/interface/forum/post/postGeneral";
import { PostSortOption } from "../../model/enum/forum/postSortOption";
import ForumPostList from "./components/ForumPostList";
import React from "react";
import InfiniteScroll from "./components/InfiniteScroll";
import LoadingState from "../../model/interface/forum/loadingState";
import { PostSearchRequestDto } from "../../model/interface/forum/post/postSearchRequestDto";

interface ForumPostsPageProps {
    posts?: PostGeneral[];
    sortOption: PostSortOption;
    onSortChange: (option: PostSortOption) => void;
    loadingState: LoadingState;
    searchFilters?: PostSearchRequestDto;
    totalSearchResults?: number;
}

export default function ForumPostsPage({
    posts,
    sortOption,
    onSortChange,
    loadingState,
    searchFilters,
    totalSearchResults,
}: ForumPostsPageProps) {
    return (
        <>
            <ForumPostList
                posts={posts}
                sortOption={sortOption}
                onSortChange={onSortChange}
                searchFilters={searchFilters}
                totalSearchResults={totalSearchResults}
            />
            <InfiniteScroll {...loadingState} />
        </>
    );
}
