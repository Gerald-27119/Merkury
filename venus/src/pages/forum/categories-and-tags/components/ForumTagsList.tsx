import ForumTag from "../ForumTag";
import TagDto from "../../../../model/interface/tagDto";
import ExpansionButton from "./ExpansionButton";

interface ForumTagsListProps {
    tags?: TagDto[];
}

export default function ForumTagsList({ tags }: ForumTagsListProps) {
    return (
        <div className="p-4">
            <span>Tags</span>
            {tags?.length ? (
                <div>
                    <ul className="mt-4 mb-2 flex flex-wrap gap-2 gap-y-3">
                        {tags.map((tag) => (
                            <li key={tag.id}>
                                <ForumTag tag={tag} />
                            </li>
                        ))}
                    </ul>
                    <ExpansionButton label="All tags" />
                </div>
            ) : (
                <span className="flex items-center">No tags found</span>
            )}
        </div>
    );
}
