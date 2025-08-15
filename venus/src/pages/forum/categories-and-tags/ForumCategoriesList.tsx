import ForumCategory from "./ForumCategory";
import ForumCategoryDto from "../../../model/interface/forum/forumCategoryDto";

type ForumCategoriesListProps = {
    categories?: ForumCategoryDto[];
};

export default function ForumCategoriesList({
    categories,
}: ForumCategoriesListProps) {
    return (
        <div className="p-4">
            <span>Categories</span>
            {categories?.length ? (
                <div className="mt-2 whitespace-nowrap">
                    <ul>
                        {categories.map((category) => (
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
    );
}
