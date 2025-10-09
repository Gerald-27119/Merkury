import { IoClose } from "react-icons/io5";
import SortingAndFilterPanel from "./SortingAndFilterPanel";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { getPaginatedExpandedSpotMediaGallery } from "../../../../../http/spots-data";
import SpotExpandedMediaGalleryPage from "../../../../../model/interface/spot/expanded-media-gallery/spotExpandedMediaGalleryPage";
import { useBoolean } from "../../../../../hooks/useBoolean";
import {
    expandedSpotGalleryMediaListAction,
    expandedSpotGalleryMediaListSelectors,
} from "../../../../../redux/expanded-spot-gallery-media-list";
import useDispatchTyped from "../../../../../hooks/useDispatchTyped";

export default function ExpandedGallerySidebar() {
    const [pageCount, setPageCount] = useState<number>(0);
    const [isMediaPagePositionFetched, setTrue] = useBoolean();

    const { spotId } = useSelectorTyped((state) => state.spotDetails);
    const { mediaType, sorting, mediaPagePosition } = useSelectorTyped(
        (state) => state.expandedSpotMediaGallery,
    );

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatchTyped();

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
        initialPageParam: pageCount,
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

    const queryClient = useQueryClient();

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

        fetchNextPage();
    }, [spotId, mediaType, sorting, mediaPagePosition]);

    const mediaList = useSelectorTyped((state) =>
        expandedSpotGalleryMediaListSelectors.selectAll(state),
    );

    return (
        <div ref={containerRef}>
            <div className="flex">
                <h2>Gallery</h2>
                <IoClose />
            </div>
            <SortingAndFilterPanel />
            <ul>{/*media*/}</ul>
            <div ref={loadMoreRef} className="invisible h-1" />
        </div>
    );
}
