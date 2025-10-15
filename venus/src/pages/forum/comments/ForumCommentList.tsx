import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";
import React from "react";
import ForumComment from "./ForumComment";
import { ForumCommentSortOption } from "../../../model/enum/forum/forumCommentSortOption";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import Error from "../../../components/error/Error";
import ForumSortDropdown from "../components/ForumSortDropdown";

interface ForumCommentListProps {
    comments?: ForumCommentGeneral[];
    sortOption?: ForumCommentSortOption;
    onSortChange?: (option: ForumCommentSortOption) => void;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    areReplies: boolean;
}

export default function ForumCommentList({
    comments,
    sortOption,
    onSortChange,
    isLoading,
    isError,
    error,
    areReplies,
}: ForumCommentListProps) {
    const options: ForumCommentSortOption[] = [
        { name: "Newest", sortBy: "PUBLISH_DATE", sortDirection: "DESC" },
        { name: "Oldest", sortBy: "PUBLISH_DATE", sortDirection: "ASC" },
        { name: "Most UpVoted", sortBy: "UP_VOTES", sortDirection: "DESC" },
        { name: "Most DownVoted", sortBy: "DOWN_VOTES", sortDirection: "DESC" },
    ];

    if (isLoading) {
        return (
            <div>
                <LoadingSpinner />
            </div>
        );
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <div>
            {!areReplies && (
                <ForumSortDropdown
                    options={options}
                    onSortChange={onSortChange}
                    selected={sortOption}
                />
            )}

            <div className="dark:bg-darkBgSoft mb-4 rounded-xl p-4 shadow-lg dark:shadow-none">
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
            </div>
        </div>
    );
}
