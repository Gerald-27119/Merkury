import ForumTagDto from "../../../model/interface/forum/forumTagDto";

interface ForumTagProps {
    tag: ForumTagDto;
}

export default function ForumTag({ tag }: ForumTagProps) {
    return (
        <span className="border-darkBorder dark:hover:bg-darkBgMuted hover:bg-lightBgDarker mt-1 cursor-pointer rounded-md border-1 border-solid p-1 text-sm select-none">
            {tag.name}
        </span>
    );
}
