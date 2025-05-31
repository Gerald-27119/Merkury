import SpotTagDto from "../../../../model/interface/spot/tag/spotTagDto";

interface FavoriteSpotTagsProps {
  tags: SpotTagDto[];
}

export default function FavoriteSpotTags({ tags }: FavoriteSpotTagsProps) {
  return (
    <ul className="flex flex-wrap space-x-3">
      {tags.map((tag) => (
        <li
          className="dark:bg-darkBgMuted bg-lightBgMuted w-fit rounded-md px-2 py-1.5 text-sm capitalize shadow-md"
          key={tag.id}
        >
          {tag.name}
        </li>
      ))}
    </ul>
  );
}
