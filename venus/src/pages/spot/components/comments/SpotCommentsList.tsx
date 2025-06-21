import { useInfiniteQuery } from "@tanstack/react-query";
import { getPaginatedSpotComments } from "../../../../http/comments";
import React, { useEffect } from "react";
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

  const comments = useSelector((state: RootState) =>
    spotCommentSelectors.selectAll(state),
  );

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

  useEffect(() => {
    if (isSuccess && data) {
      const allItems = data.pages.flatMap((p: SpotCommentPage) => p.content);
      dispatch(spotCommentSliceAction.upsertComments(allItems));
    }
  }, [data, dispatch]);
  return (
    <>
      {isFetchingNextPage && <LoadingSpinner />}
      {comments?.length === 0 ? (
        <p>There are no comments!</p>
      ) : (
        <div className="bg-violetDark mt-4 flex flex-col items-center rounded-xl">
          <SpotCommentHeader />
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="mx-3 mt-2">
                <SpotComment comment={comment} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
