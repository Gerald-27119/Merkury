import PostCategory from "../../categories-and-tags/PostCategory";
import PostTag from "../../categories-and-tags/PostTag";
import PostCategoryDto from "../../../../model/interface/forum/postCategoryDto";
import TagDto from "../../../../model/interface/tagDto";

interface PostMetaDataProps {
    category?: PostCategoryDto;
    tags?: TagDto[];
}

export default function PostMetaData({ category, tags }: PostMetaDataProps) {
    return (
        <div>
            {category && (
                <div className="mt-2 flex flex-wrap gap-2">
                    <PostCategory category={category} />
                </div>
            )}
            {tags && tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <PostTag key={tag.id} tag={tag} />
                    ))}
                </div>
            )}
        </div>
    );
}
