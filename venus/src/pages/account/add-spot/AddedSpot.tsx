import AccountTitle from "../components/AccountTitle";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import AccountWrapper from "../components/AccountWrapper";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllSpotsAddedByUser } from "../../../http/user-dashboard";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import { useEffect, useRef } from "react";
import { AddedSpotTile } from "./components/AddedSpotTile";
import Button from "../../../components/buttons/Button";
import { ButtonVariantType } from "../../../model/enum/buttonVariantType";
import { useBoolean } from "../../../hooks/useBoolean";
import AddSpotModal from "./components/AddSpotModal";

//todo dodać responsywność
export default function AddedSpot() {
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, open, close, _] = useBoolean(false);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["add-spot"],
            queryFn: ({ pageParam = 0 }) =>
                getAllSpotsAddedByUser(pageParam, 4),
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

    return (
        <>
            <AccountWrapper variant={AccountWrapperType.ADD_SPOT}>
                <div className="flex items-center justify-between space-y-2 space-x-3 lg:mr-27">
                    <AccountTitle text="Add spot" />
                    <Button variant={ButtonVariantType.ADD_SPOT} onClick={open}>
                        Add spot
                    </Button>
                </div>

                {isLoading && <LoadingSpinner />}

                <div className="flex flex-col items-center space-y-5 lg:mx-27">
                    {allItems?.length
                        ? allItems?.map((addedSpot) => (
                              <AddedSpotTile
                                  key={addedSpot.id}
                                  spot={addedSpot}
                              />
                          ))
                        : !isLoading && (
                              <p className="mt-10 text-center text-gray-500">
                                  You didn't add any spots yet.
                              </p>
                          )}
                </div>

                <div ref={loadMoreRef} className="h-10" />
                {isFetchingNextPage && <LoadingSpinner />}
            </AccountWrapper>
            <AddSpotModal onClose={close} isOpen={isOpen} />
        </>
    );
}
