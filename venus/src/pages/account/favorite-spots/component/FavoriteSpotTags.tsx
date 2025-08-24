import TagDto from "../../../../model/interface/tagDto";

interface FavoriteSpotTagsProps {
    tags: TagDto[];
}

export default function FavoriteSpotTags({ tags }: FavoriteSpotTagsProps) {
    return (
        <ul className="flex flex-wrap gap-3 lg:gap-0 lg:space-x-3">
            {tags.map((tag) => (
                <li
                    className="dark:bg-darkBgMuted bg-lightBgMuted w-fit rounded-md px-2 py-1.5 text-sm capitalize shadow-md dark:shadow-black/50"
                    key={tag.id}
                >
                    {tag.name}
                </li>
            ))}
        </ul>
    );
}
