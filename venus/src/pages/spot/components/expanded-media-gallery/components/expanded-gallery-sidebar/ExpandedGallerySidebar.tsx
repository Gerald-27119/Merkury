import { IoClose } from "react-icons/io5";
import SortingAndFilterPanel from "./SortingAndFilterPanel";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import useSelectorTyped from "../../../../../../hooks/useSelectorTyped";
import {
    getExpandedSpotMediaGalleryPagePosition,
    getPaginatedExpandedSpotMediaGallery,
} from "../../../../../../http/spots-data";
import SpotExpandedMediaGalleryPage from "../../../../../../model/interface/spot/expanded-media-gallery/spotExpandedMediaGalleryPage";
import { useBoolean } from "../../../../../../hooks/useBoolean";
import {
    expandedSpotGalleryMediaListAction,
    expandedSpotGalleryMediaListSelectors,
} from "../../../../../../redux/expanded-spot-gallery-media-list";
import useDispatchTyped from "../../../../../../hooks/useDispatchTyped";
import LoadingSpinner from "../../../../../../components/loading-spinner/LoadingSpinner";
import { MediaType } from "../../../../../../model/enum/mediaType";
import { expandedSpotMediaGalleryModalsActions } from "../../../../../../redux/expanded-spot-media-gallery-modals";
import { expandedSpotMediaGalleryAction } from "../../../../../../redux/expanded-spot-media-gallery";
import { FaChevronLeft, FaRegCirclePlay } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import ReactPlayer from "react-player";
import SpotExpandedGallerySidebarMediaDto from "../../../../../../model/interface/spot/expanded-media-gallery/spotExpandedGallerySidebarMediaDto";

const slideVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
};

export default function ExpandedGallerySidebar() {
    const [pageCount, setPageCount] = useState<number>(0);
    const [isMediaPagePositionFetched, setTrue] = useBoolean();
    const [currentMediaType, setCurrentMediaType] = useState<MediaType>(
        MediaType.PHOTO,
    );

    const { spotId } = useSelectorTyped((state) => state.spotDetails);
    const { mediaType, sorting, mediaPagePosition, mediaId } = useSelectorTyped(
        (state) => state.expandedSpotMediaGallery,
    );
    const { showExpandedGallerySidebar } = useSelectorTyped(
        (state) => state.expandedSpotMediaGalleryModals,
    );

    const { showExpandedGallery } = useSelectorTyped(
        (state) => state.expandedSpotMediaGalleryModals,
    );

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

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
            "expanded-spot-media-gallery",
            spotId,
            mediaType,
            sorting,
            mediaPagePosition,
        ],
        queryFn: ({ pageParam }) =>
            getPaginatedExpandedSpotMediaGallery(
                spotId!,
                mediaType,
                sorting,
                pageParam as number,
            ),
        getNextPageParam: (lastPage: SpotExpandedMediaGalleryPage) => {
            const { number, totalPages } = lastPage.page;
            return number + 1 < totalPages ? number + 1 : undefined;
        },
        enabled: !!spotId && isMediaPagePositionFetched,
        initialPageParam: mediaPagePosition,
    });

    useEffect(() => {
        if (!isMediaPagePositionFetched) {
            setPageCount(mediaPagePosition);
            setTrue();
        }
    }, [mediaPagePosition, isMediaPagePositionFetched]);

    useEffect(() => {
        if (isSuccess && data) {
            const allItems = data.pages.flatMap(
                (p: SpotExpandedMediaGalleryPage) => p.content,
            );
            dispatch(
                expandedSpotGalleryMediaListAction.upsertMediaList(allItems),
            );
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

    const mediaList = useSelectorTyped((state) =>
        expandedSpotGalleryMediaListSelectors.selectAll(state),
    );

    useEffect(() => {
        dispatch(expandedSpotGalleryMediaListAction.clearMediaList());
        queryClient.removeQueries({
            queryKey: [
                "expanded-spot-media-gallery",
                spotId,
                mediaType,
                sorting,
                mediaPagePosition,
            ],
        });
        setCurrentMediaType(mediaType);
    }, [mediaType]);
    //TODO: when mediaTypes change wrong mediaId is set
    useEffect(() => {
        if (
            mediaType !== currentMediaType &&
            mediaList &&
            mediaList.length > 0
        ) {
            dispatch(
                expandedSpotMediaGalleryAction.setExpandedGalleryMediaId({
                    mediaId: mediaList.at(0)!.id,
                }),
            );
        }
    }, [mediaList, currentMediaType, mediaType]);

    // useEffect(() => {
    //     const fetchMediaPagePosition = async () => {
    //         const { mediaPagePosition } =
    //             await getExpandedSpotMediaGalleryPagePosition(
    //                 spotId!,
    //                 mediaId,
    //                 mediaType,
    //                 sorting,
    //             );
    //         dispatch(
    //             expandedSpotMediaGalleryAction.setExpandedGalleryMediaPagePosition(
    //                 {
    //                     mediaPagePosition,
    //                 },
    //             ),
    //         );
    //         dispatch(expandedSpotGalleryMediaListAction.clearMediaList());
    //         queryClient.removeQueries({
    //             queryKey: [
    //                 "expanded-spot-media-gallery",
    //                 spotId,
    //                 mediaType,
    //                 sorting,
    //                 mediaPagePosition,
    //             ],
    //         });
    //     };
    //
    //     fetchMediaPagePosition();
    // }, [spotId, mediaType, sorting, mediaPagePosition]);

    const handleCloseSidebar = () => {
        dispatch(
            expandedSpotMediaGalleryModalsActions.closeExpandedGallerySidebar(),
        );
    };

    const handleClickToggleSidebar = () => {
        dispatch(
            expandedSpotMediaGalleryModalsActions.toggleExpandedGallerySidebar(),
        );
    };

    const handleClickSetCurrentMedia = (
        media: SpotExpandedGallerySidebarMediaDto,
    ) => {
        queryClient.removeQueries({
            queryKey: ["expanded-media-display", mediaType, mediaId, spotId],
        });
        dispatch(
            expandedSpotMediaGalleryAction.setExpandedGalleryMediaId({
                mediaId: media.id,
            }),
        );
        dispatch(
            expandedSpotMediaGalleryAction.setExpandedGalleryMediaType({
                mediaType: media.mediaType,
            }),
        );
    };

    //TODO: do sth with this

    // useEffect(() => {
    //     if (mediaType !== currentMediaType && isSuccess) {
    //         setCurrentMediaType(mediaType);
    //     }
    // }, [mediaType, isSuccess]);

    // useEffect(() => {
    //     if (
    //         showExpandedGallery &&
    //         isMediaPagePositionFetched &&
    //         mediaList.length > 0 &&
    //         mediaType !== currentMediaType
    //     ) {
    //         const currentMedia = mediaList.at(0)!;
    //         console.log(currentMedia.mediaType, +" from sidebar");
    //         dispatch(
    //             expandedSpotMediaGalleryAction.setExpandedGalleryMediaType({
    //                 mediaType: currentMedia.mediaType,
    //             }),
    //         );
    //         dispatch(
    //             expandedSpotMediaGalleryAction.setExpandedGalleryMediaId({
    //                 mediaId: currentMedia.id,
    //             }),
    //         );
    //         setCurrentMediaType(mediaType);
    //         queryClient.removeQueries({
    //             queryKey: [
    //                 "expanded-media-display",
    //                 mediaType,
    //                 mediaId,
    //                 spotId,
    //             ],
    //         });
    //     }
    // }, []);

    return (
        <div className="flex items-center bg-black">
            <AnimatePresence>
                {showExpandedGallerySidebar && (
                    <motion.div
                        key="spot-expanded-media-gallery-sidebar"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={slideVariants}
                        transition={{ duration: 0.3 }}
                        ref={containerRef}
                        className="dark:bg-violetHeavyDark h-full w-[20rem] overflow-y-auto p-2 xl:w-[30rem] xl:overflow-y-hidden"
                    >
                        <div className="mt-1 grid w-full grid-cols-3 items-center">
                            <div></div>
                            <h2 className="text-center text-2xl">Gallery</h2>
                            <IoClose
                                onClick={handleCloseSidebar}
                                className="ml-auto cursor-pointer justify-self-end text-2xl"
                            />
                        </div>
                        <SortingAndFilterPanel />
                        {isLoading && <LoadingSpinner />}
                        {mediaList.length === 0 ? (
                            <p className="text-center">
                                No{" "}
                                {mediaType === MediaType.PHOTO
                                    ? "photos"
                                    : "films"}{" "}
                                to display.
                            </p>
                        ) : (
                            <ul className="flex flex-col items-center space-y-2">
                                {mediaList.map((media) =>
                                    media.mediaType === MediaType.PHOTO ? (
                                        <li
                                            key={media.id}
                                            className="cursor-pointer overflow-hidden first:rounded-t-2xl"
                                            onClick={() =>
                                                handleClickSetCurrentMedia(
                                                    media,
                                                )
                                            }
                                        >
                                            <img
                                                src={media.url}
                                                alt={media.url}
                                            />
                                        </li>
                                    ) : (
                                        <li
                                            key={media.id}
                                            className="relative first:rounded-t-2xl"
                                            onClick={() =>
                                                handleClickSetCurrentMedia(
                                                    media,
                                                )
                                            }
                                        >
                                            <div className="bg-darkBg/80 absolute inset-0 z-10 flex cursor-pointer items-center justify-center text-2xl 2xl:text-4xl">
                                                <FaRegCirclePlay />
                                            </div>
                                            <div className="z-10 flex items-center justify-center">
                                                <ReactPlayer
                                                    playing={false}
                                                    src={media.url}
                                                    controls={false}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        aspectRatio: "16/9",
                                                        "--controls": "none",
                                                    }}
                                                />
                                            </div>
                                        </li>
                                    ),
                                )}
                            </ul>
                        )}
                        {isFetchingNextPage && <LoadingSpinner />}
                        <div ref={loadMoreRef} className="invisible h-1" />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex h-full items-center bg-black">
                <div
                    className="bg-violetLightDark hover:bg-violetLightDarker w-fit cursor-pointer rounded-r-2xl py-3.5"
                    onClick={handleClickToggleSidebar}
                >
                    <FaChevronLeft
                        className={`text-3xl text-black transition-transform ${
                            showExpandedGallerySidebar ? "" : "rotate-180"
                        }`}
                    />
                </div>
            </div>
        </div>
    );
}
