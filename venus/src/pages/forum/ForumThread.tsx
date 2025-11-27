import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import DetailedPost from "./posts/DetailedPost";
import ReturnButton from "./components/ReturnButton";
import { addComment, getCommentsByPostId } from "../../http/post-comments";
import React, { useEffect, useRef, useState } from "react";
import { PostCommentSortOption } from "../../model/enum/forum/postCommentSortOption";
import PostCommentList from "./comments/components/PostCommentList";
import { useBoolean } from "../../hooks/useBoolean";
import PostCommentForm from "./comments/components/PostCommentForm";
import { fetchDetailedPost, followPost } from "../../http/posts";
import PostCommentDto from "../../model/interface/forum/postComment/postCommentDto";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { notificationAction } from "../../redux/notification";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import { useAppMutation } from "../../hooks/useAppMutation";
import PostCommentPage from "../../model/interface/forum/postComment/postCommentPage";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";
import FollowPostButton from "./components/FollowPostButton";

export default function ForumThread({}) {
    const { postId } = useParams<{ postId: string }>();
    const parsedPostId = Number(postId);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatchTyped();
    const isLogged = useSelector((state: RootState) => state.account.isLogged);
    const [isCommentFormVisible, showCommentForm, hideCommentForm] =
        useBoolean(false);
    const [sortOption, setSortOption] = useState<PostCommentSortOption>({
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
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<PostCommentPage>({
        queryKey: ["forumComments", parsedPostId, sortOption],
        queryFn: ({ pageParam }) =>
            getCommentsByPostId(
                parsedPostId,
                pageParam as number,
                10,
                sortOption,
            ),
        getNextPageParam: (lastPage: PostCommentPage) => {
            const { number, totalPages } = lastPage.page;
            return number + 1 < totalPages ? number + 1 : undefined;
        },
        initialPageParam: 0,
    });

    const { mutateAsync: addCommentMutate } = useAppMutation(addComment, {
        successMessage: "Comment added successfully!",
        invalidateKeys: [["forumComments", parsedPostId]],
        loginToAccessMessage: "Login to comment",
    });

    const { mutateAsync: followPostMutate } = useAppMutation(followPost, {
        successMessage: "Post is now being followed!",
        loginToAccessMessage: "Login to follow posts",
        invalidateKeys: [["post", parsedPostId], ["followedPosts"]],
    });

    const handleAddComment = async (newComment: PostCommentDto) => {
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

    const handlePostFollow = async (postId: number) => {
        await followPostMutate(postId);
    };

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target || !hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: "50px", threshold: 0 },
        );
        observer.observe(target);
        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, fetchNextPage, sortOption, isFetchingNextPage]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [parsedPostId]);

    const comments = forumCommentPage?.pages.flatMap(
        (page: PostCommentPage) => page.content ?? [],
    );

    return (
        <div className="mx-auto w-xl md:w-2xl lg:w-3xl">
            <div className="flex justify-between">
                <ReturnButton />
                {!isPostDetailsLoading && !postDetails?.isAuthor && (
                    <FollowPostButton
                        onClick={handlePostFollow}
                        postId={postDetails?.id}
                        isFollowed={postDetails?.isFollowed}
                    />
                )}
            </div>

            <DetailedPost
                post={postDetails!}
                isLoading={isPostDetailsLoading}
                isError={isPostDetailsError}
                error={postDetailsError}
                onAddCommentClick={handleAddCommentClick}
                handleFollow={handlePostFollow}
            />

            {isCommentFormVisible && (
                <PostCommentForm
                    handleComment={handleAddComment}
                    onClose={hideCommentForm}
                />
            )}

            <PostCommentList
                postId={postDetails?.id}
                comments={comments}
                sortOption={sortOption}
                onSortChange={setSortOption}
                isLoading={isForumCommentPageLoading}
                isError={isForumCommentPageError}
                error={forumCommentPageError}
                areReplies={false}
            />
            <div ref={loadMoreRef} className="flex items-center justify-center">
                {isFetchingNextPage && <LoadingSpinner />}
            </div>
        </div>
    );
}
