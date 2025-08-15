import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import Error from "../../../components/error/Error";
import ForumCategoryAndTagsDto from "../../../model/interface/forum/forumCategoryAndTagsDto";
import ForumCategoriesList from "./ForumCategoriesList";
import ForumTagsList from "./ForumTagsList";

interface ForumCategoriesTagsPanelProps {
    data?: ForumCategoryAndTagsDto;
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
        return <LoadingSpinner />;
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <div className="dark:bg-darkBgSoft mt-4 w-52 rounded-2xl shadow-lg">
            <ForumCategoriesList categories={data?.categories} />
            <ForumTagsList tags={data?.tags} />
        </div>
    );
}
