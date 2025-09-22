import { useQuery } from "@tanstack/react-query";
import { fetchDetailedPost } from "../../http/posts";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";
import Error from "../../components/error/Error";
import DetailedPost from "./posts/DetailedPost";
import ReturnButton from "./components/ReturnButton";

export default function ForumThread({}) {
    const { postId } = useParams<{ postId: string }>();
    const parsedPostId = Number(postId);

    const { data, error, isError, isLoading } = useQuery({
        queryKey: ["post", parsedPostId],
        queryFn: () => fetchDetailedPost(parsedPostId),
        enabled: !isNaN(parsedPostId),
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg min-h-screen w-full">
            <div className="relative mx-auto mt-16 max-w-3xl">
                <ReturnButton />
                {data ? <DetailedPost post={data} /> : <span>No info</span>}
            </div>
        </div>
    );
}
