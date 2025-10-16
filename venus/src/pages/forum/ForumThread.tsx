import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { notificationAction } from "../../redux/notification";
import { AxiosError } from "axios";
import { fetchDetailedPost } from "../../http/posts";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import ForumCommentDto from "../../model/interface/forum/postComment/forumCommentDto";

export default function ForumThread({}) {
    const { postId } = useParams<{ postId: string }>();
    const parsedPostId = Number(postId);
    const queryClient = useQueryClient();
    const dispatch = useDispatchTyped();
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

    const { mutateAsync: mutateNewComment } = useMutation({
        mutationFn: addComment,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["forumComments"],
            });
            dispatch(
                notificationAction.addSuccess({
                    message: "Comment created successfully!",
                }),
            );
        },
        onError: (e: AxiosError) => {
            if (e.status === 401) {
                dispatch(
                    notificationAction.addInfo({
                        message: "Login to add comments.",
                    }),
                );
            } else {
                dispatch(
                    notificationAction.addError({
                        message:
                            "Failed to create comment. Please try again later.",
                    }),
                );
            }
        },
    });

    const handleAddComment = async (newComment: ForumCommentDto) => {
        await mutateNewComment({ postId: parsedPostId, newComment });
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
