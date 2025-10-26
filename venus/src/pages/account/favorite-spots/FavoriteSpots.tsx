import AccountTitle from "../components/AccountTitle";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserFavoriteSpots } from "../../../http/user-dashboard";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import FavoriteSpotTile from "./component/FavoriteSpotTile";
import { FavoriteSpotsListType } from "../../../model/enum/account/favorite-spots/favoriteSpotsListType";
import { useEffect, useRef, useState } from "react";
import Button from "../../../components/buttons/Button";
import { ButtonVariantType } from "../../../model/enum/buttonVariantType";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";

const menuTypes = [
    { label: "All", type: FavoriteSpotsListType.ALL },
    { label: "Favorites", type: FavoriteSpotsListType.FAVORITE },
    { label: "Plan to visit", type: FavoriteSpotsListType.PLAN_TO_VISIT },
    { label: "Visited liked it", type: FavoriteSpotsListType.VISITED_LIKED_IT },
    {
        label: "Visited didn't like it",
        type: FavoriteSpotsListType.VISITED_NOT_LIKED_IT,
    },
];

export default function FavoriteSpots() {
    const [selectedType, setSelectedType] = useState(FavoriteSpotsListType.ALL);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["favorite-spots", selectedType],
            queryFn: ({ pageParam = 0 }) =>
                getUserFavoriteSpots(selectedType, pageParam, 10),
            getNextPageParam: (lastPage, allPages) =>
                lastPage.hasNext ? allPages.length : undefined,
            initialPageParam: 0,
        });

    const allItems = data?.pages.flatMap((page) => page.items);
    console.log(allItems)

    const handleSetSelectedType = (type: FavoriteSpotsListType) => {
        setSelectedType(type);
    };

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

    return (
        <AccountWrapper variant={AccountWrapperType.FAVORITE_SPOTS}>
            <AccountTitle text="spots lists" />
            <div className="flex max-w-full flex-col items-center gap-5 lg:flex-row xl:mx-27">
                {menuTypes.map((m) => (
                    <Button
                        key={m.label}
                        variant={ButtonVariantType.FAVORITE_SPOT_MENU}
                        onClick={() => handleSetSelectedType(m.type)}
                        className={
                            selectedType === m.type
                                ? "dark:bg-violetLight bg-violetDark/87"
                                : "dark:bg-violetDark bg-violetLight"
                        }
                    >
                        {m.label}
                    </Button>
                ))}
            </div>
            {isLoading && <LoadingSpinner />}
            <div className="flex flex-col items-center space-y-5 lg:mx-27">
                {allItems?.length
                    ? allItems?.map((spot) => (
                          <FavoriteSpotTile
                              spot={spot}
                              key={spot.id}
                              selectedType={selectedType}
                          />
                      ))
                    : !isLoading && (
                          <p className="mt-10 text-center text-gray-500">
                              You don't have any spots in your list.
                          </p>
                      )}
                <div ref={loadMoreRef} className="h-10" />
                {isFetchingNextPage && <LoadingSpinner />}
            </div>
        </AccountWrapper>
    );
}
