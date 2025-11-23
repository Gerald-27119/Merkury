import Error from "../../../components/error/Error";
import TrendingPostDto from "../../../model/interface/forum/trendingPostDto";
import TrendingPostsList from "./TrendingPostsList";
import SkeletonTrendingPost from "../posts/components/SkeletonTrendingPost";
import React from "react";

interface TrendingPostsPanelProps {
    data?: TrendingPostDto[];
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
}

export default function TrendingPostsPanel({
    data,
    isLoading,
    isError,
    error,
}: TrendingPostsPanelProps) {
    if (isLoading) {
        return <SkeletonTrendingPost />;
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft mt-4 inline-block w-full rounded-2xl break-words shadow-lg">
            <TrendingPostsList posts={data} />
        </div>
    );
}
