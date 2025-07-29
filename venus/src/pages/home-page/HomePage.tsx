import { useQuery } from "@tanstack/react-query";
import { get18MostPopularSpots } from "../../http/spots-data";
import Carousel from "./components/Carousel";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";
import SearchBar from "./components/SearchBar";
import { useState } from "react";
import SearchSpotDto from "../../model/interface/spot/search-spot/searchSpotDto";
import SearchSpotList from "./components/SearchSpotList";

export default function HomePage() {
    const { data, isLoading } = useQuery({
        queryKey: ["mostPopular"],
        queryFn: get18MostPopularSpots,
    });

    const [searchedSpots, setSearchedSpots] = useState<SearchSpotDto[]>([]);

    const handleSetSearchedSpots = (spots: SearchSpotDto[]) => {
        setSearchedSpots(spots);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="dark:bg-darkBg dark:text-darkText text-lightText flex min-h-screen w-full flex-col items-center space-y-4 overflow-hidden p-8">
            <SearchBar onSetSpots={handleSetSearchedSpots} />
            <div className="flex w-full flex-col items-center space-y-4">
                <h1 className="text-center text-3xl">The Most Popular Spots</h1>
                <div className="flex flex-col items-center space-y-10">
                    <Carousel spots={data!} spotsPerPage={6} />
                    <SearchSpotList spots={searchedSpots} />
                </div>
            </div>
        </div>
    );
}
