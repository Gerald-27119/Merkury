import PostCategory from "../PostCategory";
import PostCategoryDto from "../../../../model/interface/forum/postCategoryDto";
import ExpansionButton from "./ExpansionButton";

interface ForumCategoriesListProps {
    categories?: PostCategoryDto[];
}

export default function ForumCategoriesList({
    categories,
}: ForumCategoriesListProps) {
    return (
        <div className="p-4">
            <span>Categories</span>
            {categories?.length ? (
                <div className="mt-2">
                    <ul>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <PostCategory category={category} />
                            </li>
                        ))}
                    </ul>
                    <ExpansionButton label="All categories" />
                </div>
            ) : (
                <span className="flex items-center">No categories found</span>
            )}
        </div>
    );
}
