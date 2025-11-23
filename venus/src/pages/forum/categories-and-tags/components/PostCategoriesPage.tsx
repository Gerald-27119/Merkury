import { useQuery } from "@tanstack/react-query";
import { fetchAllCategoriesAlphabetically } from "../../../../http/posts";
import Error from "../../../../components/error/Error";
import PostCategoryDescription from "../PostCategoryDescription";
import ForumLayout from "../../ForumLayout";
import SkeletonAllPostCategories from "./SkeletonAllPostCategories";
import React from "react";

export default function PostCategoriesPage() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["postCategories"],
        queryFn: () => fetchAllCategoriesAlphabetically(),
    });

    if (isLoading) {
        return (
            <ForumLayout>
                <div className="w-md md:w-2xl">
                    <h1 className="mb-5 text-3xl font-bold">Categories</h1>
                    {Array.from({ length: 9 }).map((_, i) => (
                        <SkeletonAllPostCategories key={i} />
                    ))}
                </div>
            </ForumLayout>
        );
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <ForumLayout>
            <div className="w-md md:w-2xl">
                <h1 className="mb-5 text-3xl font-bold">Categories</h1>
                <div>
                    <ul className="space-y-4">
                        {data?.map((category) => (
                            <li key={category.id}>
                                <PostCategoryDescription category={category} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </ForumLayout>
    );
}
