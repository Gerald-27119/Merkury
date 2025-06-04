import { useInfiniteQuery } from "@tanstack/react-query";
import { getPaginatedSpotComments } from "../../../../http/comments";
import React from "react";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";

type commentsListProps = {
  spotId: number;
};

export default function CommentsList({ spotId }: commentsListProps) {
  const {
    data,
    isError,
    isLoading,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["spot-comments", spotId],
    queryFn: ({ pageParam }) =>
      getPaginatedSpotComments(spotId, pageParam as number),
    getNextPageParam: (last) => last.nextPage,
    initialPageParam: 0,
  });

  return (
    <>
      <span>comments</span>
      {isFetchingNextPage && <LoadingSpinner />}
    </>
  );
}
