import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
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
  const [pageCount, setPageCount] = useState<number>(0);
  const [shouldDisplayShowMoreButton, setShouldDisplayShowMoreButton] =
    useState<boolean>(true);

  const handleClickShowMoreComments = (): void => {
    fetchNextPage();
    setShowMoreComments(true);
  };

  const comments = useSelector((state: RootState) =>
    spotCommentSelectors.selectAll(state),
  );

  const queryClient = useQueryClient();

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (isSuccess && data?.pages[data.pages.length - 1]?.totalPages <= 1) {
      setShouldDisplayShowMoreButton(false);
    } else {
      setShouldDisplayShowMoreButton(true);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess && data) {
      const allItems = data.pages.flatMap((p: SpotCommentPage) => p.content);
      dispatch(spotCommentSliceAction.upsertComments(allItems));
      setPageCount(data.pages.length);
    }
  }, [data, dispatch]);

  useEffect(() => {
    const container = containerRef.current;
    const target = loadMoreRef.current;
    if (!container || !target || !hasNextPage || !showMoreComments) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(target);
          fetchNextPage();
        }
      },
      {
        root: container,
        rootMargin: "50px",
        threshold: 0,
      },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, showMoreComments, pageCount]);

  useEffect(() => {
    dispatch(spotCommentSliceAction.clearComments());
    queryClient.removeQueries({ queryKey: ["spot-comments", spotId] });

    fetchNextPage();
  }, [spotId]);

  return (
    <div className="mt-3">
      {isLoading && <LoadingSpinner />}
      {isError && (
        <p className="mt-20 text-center text-2xl font-semibold">
          Failed to load comments.
        </p>
      )}
      <SpotCommentHeader />
      <div
        ref={containerRef}
        className="dark:bg-violetDark dark:scrollbar-track-violetDark dark:hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin flex h-[30rem] flex-col items-center overflow-y-auto rounded-b-xl"
      >
        {comments?.length === 0 ? (
          <p className="mt-20 text-center text-2xl font-semibold">
            There are no comments!
          </p>
        ) : (
          <>
            <ul>
              {comments.map((comment) => (
                <li key={comment.id} className="mx-3 mt-2 mb-6">
                  <SpotComment comment={comment} />
                </li>
              ))}
            </ul>
            {!showMoreComments && shouldDisplayShowMoreButton && (
              <div className="text-center">
                <button
                  onClick={handleClickShowMoreComments}
                  className="mt-8 mb-10 w-fit cursor-pointer font-semibold"
                >
                  Show More
                </button>
              </div>
            )}
            {isFetchingNextPage && <LoadingSpinner />}
          </>
        )}
        <div
          ref={loadMoreRef}
          className={`h-1 ${showMoreComments ? "" : "invisible"}`}
        />
      </div>
    </div>
  );
}
