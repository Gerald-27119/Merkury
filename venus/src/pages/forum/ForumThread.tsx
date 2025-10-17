import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import DetailedPost from "./posts/DetailedPost";
import ReturnButton from "./components/ReturnButton";
import ForumLayout from "./components/ForumLayout";
import { addComment, getCommentsByPostId } from "../../http/post-comments";
import { useState } from "react";
import { ForumCommentSortOption } from "../../model/enum/forum/forumCommentSortOption";
import ForumCommentList from "./comments/ForumCommentList";
import { useBoolean } from "../../hooks/useBoolean";
import ForumCommentForm from "./comments/ForumCommentForm";
import { fetchDetailedPost } from "../../http/posts";
import ForumCommentDto from "../../model/interface/forum/postComment/forumCommentDto";
import useForumEntityActions from "../../hooks/useForumEntityActions";
import { ForumEntityPayloads } from "../../model/interface/forum/forumEntityPayloads";

export default function ForumThread({}) {
    const { postId } = useParams<{ postId: string }>();
    const parsedPostId = Number(postId);
    const [isCommentFormVisible, showCommentForm, hideCommentForm] =
        useBoolean(false);
    const [sortOption, setSortOption] = useState<ForumCommentSortOption>({
        name: "Newest",
        sortBy: "PUBLISH_DATE",
        sortDirection: "DESC",
    });

    const {
        data: PostDetails,
        error: PostDetailsError,
        isError: isPostDetailsError,
        isLoading: isPostDetailsLoading,
    } = useQuery({
        queryKey: ["post", parsedPostId],
        queryFn: () => fetchDetailedPost(parsedPostId),
        enabled: !isNaN(parsedPostId),
    });

    const {
        data: forumCommentPage,
        error: forumCommentPageError,
        isError: isforumCommentPageError,
        isLoading: isforumCommentPageLoading,
    } = useQuery({
        queryKey: ["forumComments", parsedPostId, sortOption],
        queryFn: () => getCommentsByPostId(parsedPostId, 0, 10, sortOption),
    });

    const { handleAdd } = useForumEntityActions<
        ForumEntityPayloads["addComment"]
    >({
        entityName: "comment",
        addFn: addComment,
        queryKeys: { list: "forumComments", single: "comment" },
    });

    const handleAddComment = async (newComment: ForumCommentDto) => {
        await handleAdd({ postId: parsedPostId, newComment });
    };

    return (
        <ForumLayout>
            <div className="mx-auto w-xl md:w-2xl lg:w-3xl">
                <ReturnButton />
                {PostDetails ? (
                    <DetailedPost
                        post={PostDetails}
                        isLoading={isPostDetailsLoading}
                        isError={isPostDetailsError}
                        error={PostDetailsError}
                        onClick={
                            isCommentFormVisible
                                ? hideCommentForm
                                : showCommentForm
                        }
                    />
                ) : (
                    <span>No info</span>
                )}

                {isCommentFormVisible && (
                    <ForumCommentForm
                        handleComment={handleAddComment}
                        onClose={hideCommentForm}
                    />
                )}

                <ForumCommentList
                    comments={forumCommentPage?.content}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                    isLoading={isforumCommentPageLoading}
                    isError={isforumCommentPageError}
                    error={forumCommentPageError}
                    areReplies={false}
                />
            </div>
        </ForumLayout>
    );
}
