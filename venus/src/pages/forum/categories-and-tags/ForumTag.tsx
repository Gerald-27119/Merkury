import TagDto from "../../../model/interface/tagDto";

interface ForumTagProps {
    tag: TagDto;
}

export default function ForumTag({ tag }: ForumTagProps) {
    return (
        <span className="border-darkBorder dark:hover:bg-darkBgMuted hover:bg-lightBgDarker mt-1 cursor-pointer rounded-md border-1 border-solid p-1 text-sm select-none">
            {tag.name}
        </span>
    );
}
