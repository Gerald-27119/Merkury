import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import Error from "../../../components/error/Error";
import ForumCategoryAndTagsDto from "../../../model/interface/forum/forumCategoryAndTagsDto";
import ForumCategory from "./ForumCategory";
import ForumTag from "./ForumTag";

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
            <div className="p-4">
                <span>Categories</span>
                {data?.categories?.length ? (
                    <div className="mt-2 whitespace-nowrap">
                        <ul>
                            {data.categories.map((category) => (
                                <li key={category.id}>
                                    <ForumCategory category={category} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <span>There are no categories</span>
                )}
            </div>

            <div className="p-4">
                <span>Tags</span>
                {data?.tags?.length ? (
                    <div>
                        <ul className="mt-4 flex flex-wrap gap-2 gap-y-3">
                            {data.tags.map((tag) => (
                                <li key={tag.id}>
                                    <ForumTag tag={tag} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <span>There are no tags</span>
                )}
            </div>
        </div>
    );
}
