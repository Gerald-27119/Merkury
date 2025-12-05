import PostCategory from "../PostCategory";
import PostCategoryDto from "../../../../model/interface/forum/postCategoryDto";
import ExpansionButton from "./ExpansionButton";
import { useNavigate } from "react-router-dom";

interface ForumCategoriesListProps {
    categories?: PostCategoryDto[];
}

export default function PostCategoriesList({
    categories,
}: ForumCategoriesListProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/forum/categories");
    };

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
                    <ExpansionButton
                        label="All categories"
                        onClick={handleClick}
                    />
                </div>
            ) : (
                <span className="flex items-center">No categories found</span>
            )}
        </div>
    );
}
