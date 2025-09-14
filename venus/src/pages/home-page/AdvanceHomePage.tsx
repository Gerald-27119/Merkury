import { useRef, useState } from "react";
import SearchSpotList from "./components/SearchSpotList";
import Switch from "./components/Switch";
import AdvanceSearchBar from "./components/AdvanceSearchBar";
import HomePageSpotDto from "../../model/interface/spot/search-spot/homePageSpotDto";

export default function AdvanceHomePage() {
    const [searchedSpots, setSearchedSpots] = useState<HomePageSpotDto[]>([]);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const handleSetSearchedSpots = (spots: HomePageSpotDto[]) => {
        setSearchedSpots(spots);
    };

    return (
        <div className="dark:bg-darkBg dark:text-darkText bg-lightBg text-lightText mt-10 flex min-h-screen w-full flex-col items-center space-y-4 overflow-hidden p-8">
            <Switch />
            <AdvanceSearchBar
                onSetSpots={handleSetSearchedSpots}
                loadMoreRef={loadMoreRef}
                onSetFetchingNextPage={setIsFetchingNextPage}
            />
            <div className="flex w-full flex-col items-center space-y-10">
                <SearchSpotList
                    spots={searchedSpots}
                    loadMoreRef={loadMoreRef}
                    isFetchingNextPage={isFetchingNextPage}
                />
            </div>
        </div>
    );
}
