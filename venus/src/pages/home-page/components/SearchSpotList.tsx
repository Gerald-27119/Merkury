import SpotTile from "./SpotTile";
import HomePageSpotDto from "../../../model/interface/spot/search-spot/homePageSpotDto";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import { MutableRefObject } from "react";

interface SearchSpotListProps {
    spots: HomePageSpotDto[];
    isFetchingNextPage: boolean;
    loadMoreRef: MutableRefObject<HTMLDivElement | null>;
}

export default function SearchSpotList({
    spots,
    isFetchingNextPage,
    loadMoreRef,
}: SearchSpotListProps) {
    return (
        <>
            <ul className="grid w-full grid-cols-1 place-items-center gap-8 xl:grid-cols-2 2xl:grid-cols-3">
                {spots.map((spot) => (
                    <SpotTile key={spot.id} spot={spot} />
                ))}
            </ul>
            <div ref={loadMoreRef} className="h-10" />
            {isFetchingNextPage && <LoadingSpinner />}
            {spots.length === 0 && (
                <p className="text-center text-2xl">
                    Search for spots to see results.
                </p>
            )}
        </>
    );
}
