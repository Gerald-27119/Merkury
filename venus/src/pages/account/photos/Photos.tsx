import { useInfiniteQuery } from "@tanstack/react-query";
import { getSortedUserPhotos } from "../../../http/user-dashboard";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import { useDateSortFilter } from "../../../hooks/useDateSortFilter";
import { useEffect, useRef } from "react";
import { notificationAction } from "../../../redux/notification";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import Media from "../components/Media";

export default function Photos() {
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
        queryKey: ["photos", sortType, searchDate.from, searchDate.to],
        queryFn: ({ pageParam = 0 }) =>
            getSortedUserPhotos(
                sortType,
                searchDate.from,
                searchDate.to,
                pageParam,
                2,
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
                notificationAction.addError({
                    message:
                        "An error occurred while trying to load your photos",
                }),
            );
        }
    }, [isError]);

    return (
        <Media
            variant={AccountWrapperType.PHOTOS}
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
