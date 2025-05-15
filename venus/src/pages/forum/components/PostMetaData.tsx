import Category from "./Category";
import Tag from "./Tag";
import TagDto from "../../../model/interface/forum/tagDto";
import CategoryDto from "../../../model/interface/forum/categoryDto";

interface PostMetaDataProps {
  category?: CategoryDto;
  tags?: TagDto[];
}

export default function PostMetaData({ category, tags }: PostMetaDataProps) {
  return (
    <div>
      {category && (
        <div className="mt-2 flex flex-wrap gap-2">
          <Category category={category} />
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag.id} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
