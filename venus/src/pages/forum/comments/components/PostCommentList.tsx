import PostCommentGeneral from "../../../../model/interface/forum/postComment/postCommentGeneral";
import PostComment from "../PostComment";
import { PostCommentSortOption } from "../../../../model/enum/forum/postCommentSortOption";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import Error from "../../../../components/error/Error";
import ForumSortDropdown from "../../components/ForumSortDropdown";
import { AnimatePresence, motion } from "framer-motion";

interface ForumCommentListProps {
    postId?: number;
    parentCommentId?: number;
    comments?: PostCommentGeneral[];
    sortOption?: PostCommentSortOption;
    onSortChange?: (option: PostCommentSortOption) => void;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    areReplies: boolean;
}

export default function PostCommentList({
    postId,
    parentCommentId,
    comments,
    sortOption,
    onSortChange,
    isLoading,
    isError,
    error,
    areReplies,
}: ForumCommentListProps) {
    const options: PostCommentSortOption[] = [
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
            {!areReplies && (
                <ForumSortDropdown
                    options={options}
                    onSortChange={onSortChange}
                    selected={sortOption}
                    disabled={!comments?.length || comments.length <= 1}
                />
            )}

            <div className="dark:bg-darkBgSoft bg-lightBgSoft mb-4 rounded-xl p-4 shadow-lg dark:shadow-none">
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
                                    <PostComment
                                        comment={comment}
                                        postId={postId}
                                        parentCommentId={parentCommentId}
                                    />
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
