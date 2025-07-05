import TagDto from "../../../model/interface/forum/tagDto";

interface TagProps {
    tag: TagDto;
}

export default function Tag({ tag }: TagProps) {
    return (
        <span className="border-darkBorder dark:hover:bg-darkBgMuted hover:bg-lightBgDarker mt-1 cursor-pointer rounded-md border-1 border-solid p-1 text-sm select-none">
            {tag.name}
        </span>
    );
}
