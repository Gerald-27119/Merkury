import { useQuery } from "@tanstack/react-query";
import { fetchDetailedPost } from "../../http/posts";
import { useParams } from "react-router-dom";
import Error from "../../components/error/Error";
import DetailedPost from "./posts/DetailedPost";
import ReturnButton from "./components/ReturnButton";
import ForumLayout from "./components/ForumLayout";
import SkeletonDetailedPost from "./posts/components/SkeletonDetailedPost";

export default function ForumThread({}) {
    const { postId } = useParams<{ postId: string }>();
    const parsedPostId = Number(postId);

    const { data, error, isError, isLoading } = useQuery({
        queryKey: ["post", parsedPostId],
        queryFn: () => fetchDetailedPost(parsedPostId),
        enabled: !isNaN(parsedPostId),
    });

    if (isLoading) {
        return (
            <ForumLayout>
                <div className="mx-auto w-xl md:w-2xl lg:w-3xl">
                    <ReturnButton />
                    <SkeletonDetailedPost />
                </div>
            </ForumLayout>
        );
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <ForumLayout>
            <div className="mx-auto w-xl md:w-2xl lg:w-3xl">
                <ReturnButton />
                {data ? <DetailedPost post={data} /> : <span>No info</span>}
            </div>
        </ForumLayout>
    );
}
