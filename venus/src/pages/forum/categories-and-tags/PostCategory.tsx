import PostCategoryDto from "../../../model/interface/forum/postCategoryDto";
import { useNavigate } from "react-router-dom";

interface ForumCategoryProps {
    category: PostCategoryDto;
}

export default function PostCategory({ category }: ForumCategoryProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        const params = new URLSearchParams();
        params.set("category", category.name);
        navigate(`/forum/search?${params.toString()}`);
    };

    return (
        <div
            onClick={handleClick}
            className="dark:hover:bg-darkBgMuted hover:bg-lightBgDarker inline-flex cursor-pointer items-center space-x-2 rounded p-1 leading-none"
        >
            <span
                className="inline-block h-4 w-1.5 rounded-full"
                style={{ backgroundColor: category.colour }}
            ></span>
            <span>{category.name}</span>
        </div>
    );
}
