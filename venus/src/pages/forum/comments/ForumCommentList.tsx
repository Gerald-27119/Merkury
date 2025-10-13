import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";
import React from "react";
import ForumComment from "./ForumComment";
import { ForumCommentSortOption } from "../../../model/enum/forum/forumCommentSortOption";

interface ForumCommentListProps {
    comments?: ForumCommentGeneral[];
    sortOption: ForumCommentSortOption;
    onSortChange: (option: ForumCommentSortOption) => void;
}

export default function ForumCommentList({
    comments,
    sortOption,
    onSortChange,
}: ForumCommentListProps) {
    return (
        <div className="dark:bg-darkBgSoft rounded-xl p-4 shadow-lg">
            {comments?.length ? (
                <div>
                    <ul className="space-y-6">
                        {comments.map((comment) => (
                            <li key={comment.id}>
                                <ForumComment comment={comment} />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <span>No comments available</span>
            )}

            <div></div>
        </div>
    );
}
