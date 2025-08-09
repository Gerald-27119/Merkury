import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { useDateSortFilter } from "../../../hooks/useDateSortFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSortedUserMovies } from "../../../http/user-dashboard";
import { useEffect, useRef } from "react";
import { notificationAction } from "../../../redux/notification";
import Media from "../components/Media";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";

export default function Movies() {
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
        queryKey: ["movies", sortType, searchDate.from, searchDate.to],
        queryFn: ({ pageParam = 0 }) =>
            getSortedUserMovies(
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
                        "An error occurred while trying to load your movies",
                }),
            );
        }
    }, [isError]);

    return (
        <Media
            variant={AccountWrapperType.MOVIES}
            searchDate={searchDate}
            onSortChange={handleSelectType}
            onDateChange={handleChangeDate}
            isLoading={isLoading}
            mediaList={allItems}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
}
