import { useQuery } from "@tanstack/react-query";
import { fetchDetailedPost } from "../../http/posts";
import { useParams } from "react-router-dom";
import Error from "../../components/error/Error";
import DetailedPost from "./posts/DetailedPost";
import ReturnButton from "./components/ReturnButton";
import ForumLayout from "./components/ForumLayout";
import SkeletonDetailedPost from "./posts/components/SkeletonDetailedPost";
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

    if (isPostDetailsLoading) {
        return (
            <ForumLayout>
                <div className="mx-auto w-xl md:w-2xl lg:w-3xl">
                    <ReturnButton />
                    <SkeletonDetailedPost />
                </div>
            </ForumLayout>
        );
    }

    if (isPostDetailsError) {
        return <Error error={PostDetailsError} />;
    }

    return (
        <ForumLayout>
            <div className="mx-auto w-xl md:w-2xl lg:w-3xl">
                <ReturnButton />
                {PostDetails ? (
                    <DetailedPost post={PostDetails} />
                ) : (
                    <span>No info</span>
                )}
                <ForumCommentList
                    comments={forumCommentPage?.content}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                />
            </div>
        </ForumLayout>
    );
}
