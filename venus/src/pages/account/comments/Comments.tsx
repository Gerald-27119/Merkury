import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllUserComments } from "../../../http/user-dashboard";
import AccountTitle from "../components/AccountTitle";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import DateBadge from "../components/DateBadge";
import CommentsList from "./components/CommentsList";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import SortAndDateFilters from "../components/SortAndDateFilters";
import { useDateSortFilter } from "../../../hooks/useDateSortFilter";
import { useEffect, useRef } from "react";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../redux/notification";

export default function Comments() {
    const dispatch = useDispatchTyped();
    const { sortType, searchDate, handleSelectType, handleChangeDate } =
        useDateSortFilter();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["comments", sortType, searchDate.from, searchDate.to],
        queryFn: ({ pageParam = 0 }) =>
            getAllUserComments(
                sortType,
                searchDate.from,
                searchDate.to,
                pageParam,
                10,
            ),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasNext ? allPages.length : undefined,
        initialPageParam: 0,
    });

    const allItems = data?.pages.flatMap((page) => page.items);

    useEffect(() => {
        if (!loadMoreRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 },
        );
        observer.observe(loadMoreRef.current);
        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        if (isError) {
            dispatch(
                notificationAction.setError({
                    message:
                        "An error occurred while trying to load your comments",
                }),
            );
        }
    }, [isError]);

    return (
        <AccountWrapper variant={AccountWrapperType.COMMENTS}>
            <div className="flex flex-wrap items-center justify-between space-y-2 space-x-3">
                <AccountTitle text="Comments" />
                <SortAndDateFilters
                    onSortChange={handleSelectType}
                    onDateChange={handleChangeDate}
                    from={searchDate.from}
                    to={searchDate.to}
                />
            </div>
            {isLoading && <LoadingSpinner />}
            <ul className="space-y-5 md:mx-27">
                {allItems?.length
                    ? allItems?.map((d) => (
                          <li
                              key={`${d.spotName}-${d.date}`}
                              className="flex flex-col space-y-5"
                          >
                              <DateBadge date={d.date}>
                                  <span className="flex flex-wrap">
                                      Comments to
                                      <p className="text-violetLight mx-2 font-semibold">
                                          {d.spotName}
                                      </p>
                                      spot
                                  </span>
                              </DateBadge>
                              <CommentsList comments={d.comments} />
                          </li>
                      ))
                    : null}
                {!allItems?.length && !isLoading ? (
                    <p className="text-center text-lg">
                        You haven't added any comments.
                    </p>
                ) : null}
                <div ref={loadMoreRef} className="h-10" />
                {isFetchingNextPage && <LoadingSpinner />}
            </ul>
        </AccountWrapper>
    );
}
