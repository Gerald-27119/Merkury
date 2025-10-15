import { useQuery } from "@tanstack/react-query";
import { fetchDetailedPost } from "../../http/posts";
import { useParams } from "react-router-dom";
import DetailedPost from "./posts/DetailedPost";
import ReturnButton from "./components/ReturnButton";
import ForumLayout from "./components/ForumLayout";
import { getCommentsByPostId } from "../../http/post-comments";
import { useState } from "react";
import { ForumCommentSortOption } from "../../model/enum/forum/forumCommentSortOption";
import ForumCommentList from "./comments/ForumCommentList";

export default function ForumThread({}) {
    const { postId } = useParams<{ postId: string }>();
    const parsedPostId = Number(postId);
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
        queryKey: ["forumComments", sortOption],
        queryFn: () => getCommentsByPostId(parsedPostId, 0, 10, sortOption),
    });

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
                    />
                ) : (
                    <span>No info</span>
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
