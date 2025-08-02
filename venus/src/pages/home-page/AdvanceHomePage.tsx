import { useState } from "react";
import SearchSpotDto from "../../model/interface/spot/search-spot/searchSpotDto";
import SearchSpotList from "./components/SearchSpotList";
import Switch from "./components/Switch";
import AdvanceSearchBar from "./components/AdvanceSearchBar";

export default function AdvanceHomePage() {
    const [searchedSpots, setSearchedSpots] = useState<SearchSpotDto[]>([]);

    const handleSetSearchedSpots = (spots: SearchSpotDto[]) => {
        setSearchedSpots(spots);
    };

    return (
        <div className="dark:bg-darkBg dark:text-darkText bg-lightBg text-lightText mt-10 flex min-h-screen w-full flex-col items-center space-y-4 overflow-hidden p-8">
            <Switch />
            <AdvanceSearchBar onSetSpots={handleSetSearchedSpots} />
            <div className="flex w-full flex-col items-center space-y-10">
                <SearchSpotList spots={searchedSpots} />
            </div>
        </div>
    );
}
