import TagDto from "../../../model/interface/tagDto";
import { useNavigate } from "react-router-dom";

interface ForumTagProps {
    tag: TagDto;
}

export default function PostTag({ tag }: ForumTagProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        const params = new URLSearchParams();
        params.set("tags", tag.name);
        navigate(`/forum/search?${params.toString()}`);
    };

    return (
        <span
            onClick={handleClick}
            className="border-darkBorder dark:hover:bg-darkBgMuted hover:bg-lightBgDarker mt-1 cursor-pointer rounded-md border-1 border-solid p-1 text-sm select-none"
        >
            {tag.name}
        </span>
    );
}
