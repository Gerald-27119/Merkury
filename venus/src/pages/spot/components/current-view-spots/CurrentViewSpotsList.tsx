import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import ListedSpotInfo from "../spot-info/ListedSpotInfo";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { currentViewSpotsListModalActions } from "../../../../redux/current-view-spots-list-modal";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCurrentViewSpots } from "../../../../http/spots-data";
import SearchSpotDtoPage from "../../../../model/interface/spot/search-spot/searchSpotDtoPage";
import { RootState } from "../../../../redux/store";
import {
    currentViewSpotsActions,
    currentViewSpotsSelectors,
} from "../../../../redux/current-view-spots";
import CurrentViewSpotsFormsContainer from "./CurrentViewSpotsFormsContainer";
import { currentViewSpotParamsActions } from "../../../../redux/current-view-spot-params";

const slideVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
};

export default function CurrentViewSpotsList() {
    const [pageCount, setPageCount] = useState<number>(0);
    const isSidebarOpen = useSelectorTyped((state) => state.sidebar.isOpen);
    const dispatch = useDispatchTyped();

    const handleClickCloseList = () => {
        dispatch(
            currentViewSpotsListModalActions.closeCurrentViewSpotsListModal(),
        );
        dispatch(currentViewSpotParamsActions.setParams({ name: "" }));
    };

    const { swLng, swLat, neLng, neLat, name, sorting, ratingFrom } =
        useSelectorTyped((state) => state.currentViewSpotsParams);

    const currentViewSpots = useSelectorTyped((state: RootState) =>
        currentViewSpotsSelectors.selectAll(state),
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
        queryKey: [
            "current-view-spots",
            swLng,
            swLat,
            neLng,
            neLat,
            name,
            sorting,
            ratingFrom,
        ],
        queryFn: ({ pageParam }) =>
            getCurrentViewSpots(
                swLng,
                swLat,
                neLng,
                neLat,
                name,
                ratingFrom,
                sorting,
                pageParam,
            ),
        getNextPageParam: (lastPage: SearchSpotDtoPage) => {
            const { number, totalPages } = lastPage.page;
            return number + 1 < totalPages ? number + 1 : undefined;
        },
        initialPageParam: 0,
    });

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSuccess && data) {
            const allItems = data.pages.flatMap(
                (s: SearchSpotDtoPage) => s.content,
            );
            dispatch(currentViewSpotsActions.upsertCurrentViewSpots(allItems));
            setPageCount(data.pages.length);
        }
    }, [data, dispatch]);

    useEffect(() => {
        const container = containerRef.current;
        const target = loadMoreRef.current;
        if (!container || !target || !hasNextPage) return;

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
    }, [fetchNextPage, hasNextPage, pageCount]);

    return (
        <>
            <div
                className={`absolute top-0 z-[5] h-screen w-screen bg-black/85 transition-opacity duration-300 ${
                    isSidebarOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
            ></div>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.3 }}
                className="dark:bg-violetDarker bg-fifth dark:text-darkText absolute top-10 left-0 z-20 flex h-full w-[20rem] flex-col items-center px-6 py-2 text-lg xl:top-0 xl:left-17 xl:w-[30rem] xl:text-xl"
            >
                <HiX
                    data-testid="current-view-spots-modal-close-btn"
                    className="mt-1 ml-auto cursor-pointer text-2xl dark:text-darkText text-violetDark"
                    onClick={handleClickCloseList}
                />
                <h1 className="mb-6 text-xl font-semibold dark:text-white text-violetBrightText">
                    Nearby Spots
                </h1>
                <CurrentViewSpotsFormsContainer />
                <div
                    ref={containerRef}
                    className="dark:scrollbar-track-violetDark scrollbar-track-lightGrayishBlue hover:scrollbar-thumb-second dark:hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin flex w-full flex-col items-center overflow-y-auto rounded-b-xl lg:h-[80rem] [@media(max-height:1080px)]:h-[50rem]"
                >
                    {isLoading && <LoadingSpinner />}
                    {isError && <p>Failed to load spots data.</p>}
                    {currentViewSpots?.length === 0 ? (
                        <p className="mt-20 text-center text-2xl font-semibold">
                            No spots match criteria!
                        </p>
                    ) : (
                        <ul className="w-full">
                            {currentViewSpots.map((currentViewSpot) => (
                                <li key={currentViewSpot.id} className="my-4">
                                    <ListedSpotInfo spot={currentViewSpot} />
                                </li>
                            ))}
                        </ul>
                    )}
                    {isFetchingNextPage && <LoadingSpinner />}
                    <div ref={loadMoreRef} className="h-1" />
                </div>
            </motion.div>
        </>
    );
}
