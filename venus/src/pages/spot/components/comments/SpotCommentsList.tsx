import { useInfiniteQuery } from "@tanstack/react-query";
import { getPaginatedSpotComments } from "../../../../http/comments";
import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import {
  spotCommentSelectors,
  spotCommentSliceAction,
} from "../../../../redux/spot-comments";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import SpotCommentPage from "../../../../model/interface/spot/comment/spotCommentPage";
import SpotComment from "./SpotComment";
import SpotCommentHeader from "./SpotCommentHeader";

type commentsListProps = {
  spotId: number;
};

export default function SpotCommentsList({ spotId }: commentsListProps) {
  const dispatch = useDispatchTyped();

  const [showMoreComments, setShowMoreComments] = useState<boolean>(false);

  const handleClickShowMoreComments = (): void => {
    fetchNextPage();
    setShowMoreComments(true);
  };

  const comments = useSelector((state: RootState) =>
    spotCommentSelectors.selectAll(state),
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

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
    getNextPageParam: (lastPage) => {
      const { number, totalPages } = lastPage;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const allItems = data.pages.flatMap((p: SpotCommentPage) => p.content);
      dispatch(spotCommentSliceAction.upsertComments(allItems));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          obs.unobserve(entry.target);
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, showMoreComments]);
  return (
    <>
      {(isFetchingNextPage || isLoading) && <LoadingSpinner />}
      {comments?.length === 0 ? (
        <p>There are no comments!</p>
      ) : (
        <>
          <div
            className={`bg-violetDark mt-4 ${showMoreComments ? "h-screen" : "h-full"} flex flex-col items-center rounded-xl`}
          >
            <SpotCommentHeader />
            <ul
              className={`scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 ${showMoreComments ? "h-full" : "h-[400px]"} overflow-y-auto`}
            >
              {comments.map((comment) => (
                <li key={comment.id} className="mx-3 mt-2 mb-6">
                  <SpotComment comment={comment} />
                </li>
              ))}
            </ul>
            {showMoreComments && <div ref={loadMoreRef} className="h-1" />}
          </div>
          {!showMoreComments && (
            <div className="text-center">
              <button
                onClick={handleClickShowMoreComments}
                className="mt-8 w-fit cursor-pointer font-semibold"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
