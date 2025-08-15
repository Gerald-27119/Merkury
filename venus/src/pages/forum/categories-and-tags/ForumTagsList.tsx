import ForumTag from "./ForumTag";
import ForumTagDto from "../../../model/interface/forum/forumTagDto";

type ForumTagsListProps = {
    tags?: ForumTagDto[];
};

export default function ForumTagsList({ tags }: ForumTagsListProps) {
    return (
        <div className="p-4">
            <span>Tags</span>
            {tags?.length ? (
                <div>
                    <ul className="mt-4 flex flex-wrap gap-2 gap-y-3">
                        {tags.map((tag) => (
                            <li key={tag.id}>
                                <ForumTag tag={tag} />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <span>There are no tags</span>
            )}
        </div>
    );
}
