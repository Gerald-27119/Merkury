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
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { notificationAction } from "../../redux/notification";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import { useAppMutation } from "../../hooks/useAppMutation";

export default function ForumThread({}) {
    const { postId } = useParams<{ postId: string }>();
    const parsedPostId = Number(postId);
    const dispatch = useDispatchTyped();
    const isLogged = useSelector((state: RootState) => state.account.isLogged);
    const [isCommentFormVisible, showCommentForm, hideCommentForm] =
        useBoolean(false);
    const [sortOption, setSortOption] = useState<ForumCommentSortOption>({
        name: "Newest",
        sortBy: "PUBLISH_DATE",
        sortDirection: "DESC",
    });

    const {
        data: postDetails,
        error: postDetailsError,
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
        isError: isForumCommentPageError,
        isLoading: isForumCommentPageLoading,
    } = useQuery({
        queryKey: ["forumComments", parsedPostId, sortOption],
        queryFn: () => getCommentsByPostId(parsedPostId, 0, 10, sortOption),
    });

    const { mutateAsync: addCommentMutate } = useAppMutation(addComment, {
        successMessage: "Comment added successfully!",
        invalidateKeys: [["forumComments", parsedPostId]],
        loginToAccessMessage: "Login to comment",
    });

    const handleAddComment = async (newComment: ForumCommentDto) => {
        await addCommentMutate({ postId: parsedPostId, newComment });
    };

    const handleAddCommentClick = () => {
        if (isLogged) {
            isCommentFormVisible ? hideCommentForm() : showCommentForm();
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Login to add comments.",
                }),
            );
        }
    };

    return (
        <ForumLayout>
            <div className="mx-auto w-xl md:w-2xl lg:w-3xl">
                <ReturnButton />
                {postDetails ? (
                    <DetailedPost
                        post={postDetails}
                        isLoading={isPostDetailsLoading}
                        isError={isPostDetailsError}
                        error={postDetailsError}
                        onAddCommentClick={handleAddCommentClick}
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
                    postId={postDetails?.id}
                    comments={forumCommentPage?.content}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                    isLoading={isForumCommentPageLoading}
                    isError={isForumCommentPageError}
                    error={forumCommentPageError}
                    areReplies={false}
                />
            </div>
        </ForumLayout>
    );
}
