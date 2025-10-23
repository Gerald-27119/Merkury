import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";
import ForumComment from "./ForumComment";
import { ForumCommentSortOption } from "../../../model/enum/forum/forumCommentSortOption";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import Error from "../../../components/error/Error";
import ForumSortDropdown from "../components/ForumSortDropdown";
import { AnimatePresence, motion } from "framer-motion";

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

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <div>
            {!areReplies && comments!.length > 1 && (
                <ForumSortDropdown
                    options={options}
                    onSortChange={onSortChange}
                    selected={sortOption}
                />
            )}

            <div className="dark:bg-darkBgSoft mb-8 rounded-xl p-4 shadow-lg dark:shadow-none">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <LoadingSpinner />
                        </motion.div>
                    ) : comments?.length ? (
                        <motion.ul
                            key="comments"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {comments.map((comment) => (
                                <li key={comment.id}>
                                    <ForumComment comment={comment} />
                                </li>
                            ))}
                        </motion.ul>
                    ) : (
                        <span>No comments available</span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
