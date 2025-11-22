import Error from "../../../../components/error/Error";
import PostCategoryAndTagsDto from "../../../../model/interface/forum/postCategoryAndTagsDto";
import ForumCategoriesList from "./ForumCategoriesList";
import ForumTagsList from "./ForumTagsList";
import SkeletonForumCategoryTag from "./SkeletonForumCategoryTag";
import PostCategoryDto from "../../../../model/interface/forum/postCategoryDto";
import TagDto from "../../../../model/interface/tagDto";

interface ForumCategoriesTagsPanelProps {
    data?: PostCategoryAndTagsDto;
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
}

export default function ForumCategoriesTagsPanel({
    data,
    isLoading,
    isError,
    error,
}: ForumCategoriesTagsPanelProps) {
    if (isLoading) {
        return <SkeletonForumCategoryTag />;
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft w-54 rounded-2xl shadow-lg">
            <ForumCategoriesList categories={data?.categories} />
            <ForumTagsList tags={data?.tags} />
        </div>
    );
}
