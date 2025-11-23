import { useQuery } from "@tanstack/react-query";
import { fetchAllTagsAlphabetically } from "../../../../http/posts";
import SkeletonForumCategoryTag from "./SkeletonForumCategoryTag";
import Error from "../../../../components/error/Error";
import PostTag from "../PostTag";
import TagDto from "../../../../model/interface/tagDto";
import ForumLayout from "../../ForumLayout";

export default function PostTagsPage() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["postCategories"],
        queryFn: () => fetchAllTagsAlphabetically(),
    });

    if (isLoading) {
        return <SkeletonForumCategoryTag />;
    }

    if (isError) {
        return <Error error={error} />;
    }

    const grouped =
        data?.reduce(
            (acc, tag) => {
                const first = tag.name[0].toUpperCase();
                if (!acc[first]) acc[first] = [];
                acc[first].push(tag);
                return acc;
            },
            {} as Record<string, TagDto[]>,
        ) ?? {};

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <ForumLayout>
            <div className="w-md space-y-8 md:w-2xl">
                <h1 className="mb-4 text-3xl font-bold">Tags</h1>
                {alphabet.map((letter) => (
                    <div
                        key={letter}
                        className="border-lightText dark:border-darkText border-t pt-6"
                    >
                        <h2 className="mb-3 text-2xl font-semibold">
                            {letter}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {grouped[letter] ? (
                                grouped[letter].map((tag) => (
                                    <div key={tag.id}>
                                        <PostTag tag={tag} />
                                    </div>
                                ))
                            ) : (
                                <span className="dark:opacity-50">No tags</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </ForumLayout>
    );
}
