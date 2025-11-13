import SkeletonForumCategoryTag from "../categories-and-tags/components/SkeletonForumCategoryTag";
import Error from "../../../components/error/Error";
import TrendingPostDto from "../../../model/interface/forum/trendingPostDto";
import TrendingPostsList from "./TrendingPostsList";

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
        return <SkeletonForumCategoryTag />;
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft inline-block max-w-full rounded-2xl break-words shadow-lg">
            <TrendingPostsList posts={data} />
        </div>
    );
}
