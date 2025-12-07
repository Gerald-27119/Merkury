import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import React from "react";

interface InfiniteScrollProps {
    loadMoreRef: React.RefObject<HTMLDivElement>;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    message?: string;
}

export default function InfiniteScroll({
    loadMoreRef,
    isFetchingNextPage,
    hasNextPage,
    message,
}: InfiniteScrollProps) {
    return (
        <div ref={loadMoreRef} className="flex items-center justify-center">
            {isFetchingNextPage && <LoadingSpinner />}
            {!hasNextPage && <p className="pb-4 font-bold">{message}</p>}
        </div>
    );
}
