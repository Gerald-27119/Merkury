import PostCategoryDto from "../../../model/interface/forum/postCategoryDto";
import { useNavigate } from "react-router-dom";

interface PostCategoryDescriptionProps {
    category: PostCategoryDto;
}

export default function PostCategoryDescription({
    category,
}: PostCategoryDescriptionProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        const params = new URLSearchParams();
        params.set("category", category.name);
        navigate(`/forum/search?${params.toString()}`);
    };

    return (
        <div
            onClick={handleClick}
            className="dark:bg-darkBgSoft bg-lightBgSoft dark:hover:bg-darkBgMuted hover:bg-lightBgDarker relative flex cursor-pointer flex-col gap-1 rounded-xl p-4 shadow-md"
        >
            <span className="font-semibold">{category.name}</span>
            <span className="opacity-70">{category.description}</span>
            <span
                className="absolute top-0 left-0 h-full w-2 rounded-l-xl"
                style={{
                    backgroundColor: category.colour,
                }}
            ></span>
        </div>
    );
}
