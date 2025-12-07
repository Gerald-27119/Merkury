import Error from "../../../../components/error/Error";
import PostCategoryAndTagsDto from "../../../../model/interface/forum/postCategoryAndTagsDto";
import PostCategoriesList from "./PostCategoriesList";
import PostTagsList from "./PostTagsList";
import SkeletonPostCategoryTag from "./SkeletonPostCategoryTag";

interface ForumCategoriesTagsPanelProps {
    data?: PostCategoryAndTagsDto;
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
}

export default function PostCategoriesTagsPanel({
    data,
    isLoading,
    isError,
    error,
}: ForumCategoriesTagsPanelProps) {
    if (isLoading) {
        return <SkeletonPostCategoryTag />;
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft w-54 rounded-2xl shadow-lg">
            <PostCategoriesList categories={data?.categories} />
            <PostTagsList tags={data?.tags} />
        </div>
    );
}
