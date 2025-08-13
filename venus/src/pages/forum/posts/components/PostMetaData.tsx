import ForumCategory from "../../categories-and-tags/ForumCategory";
import ForumTag from "../../categories-and-tags/ForumTag";
import ForumTagDto from "../../../../model/interface/forum/forumTagDto";
import ForumCategoryDto from "../../../../model/interface/forum/forumCategoryDto";

interface PostMetaDataProps {
    category?: ForumCategoryDto;
    tags?: ForumTagDto[];
}

export default function PostMetaData({ category, tags }: PostMetaDataProps) {
    return (
        <div>
            {category && (
                <div className="mt-2 flex flex-wrap gap-2">
                    <ForumCategory category={category} />
                </div>
            )}
            {tags && tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <ForumTag key={tag.id} tag={tag} />
                    ))}
                </div>
            )}
        </div>
    );
}
