import { useQuery } from "@tanstack/react-query";
import { get18MostPopularSpots } from "../../http/spots-data";
import Carousel from "./components/Carousel";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";
import SearchBar from "./components/SearchBar";
import { useEffect, useRef, useState } from "react";
import SearchSpotList from "./components/SearchSpotList";
import Switch from "./components/Switch";
import HomePageSpotDto from "../../model/interface/spot/search-spot/homePageSpotDto";

export default function HomePage() {
    const { data, isLoading } = useQuery({
        queryKey: ["mostPopular"],
        queryFn: get18MostPopularSpots,
    });

    const [searchedSpots, setSearchedSpots] = useState<HomePageSpotDto[]>([]);
    const [spotsPerPage, setSpotsPerPage] = useState(6);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width <= 1024) {
                setSpotsPerPage(2);
            } else if (width <= 1536) {
                setSpotsPerPage(4);
            } else {
                setSpotsPerPage(6);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSetSearchedSpots = (spots: HomePageSpotDto[]) => {
        setSearchedSpots(spots);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="dark:bg-darkBg dark:text-darkText bg-lightBg text-lightText mt-10 flex min-h-screen w-full flex-col items-center space-y-4 overflow-hidden p-8">
            <Switch />
            <SearchBar
                onSetSpots={handleSetSearchedSpots}
                loadMoreRef={loadMoreRef}
                onSetFetchingNextPage={setIsFetchingNextPage}
            />
            <div className="flex w-full flex-col items-center space-y-4">
                <h1 className="text-center text-3xl">The Most Popular Spots</h1>
                <div className="flex w-full flex-col items-center space-y-10">
                    <Carousel spots={data!} spotsPerPage={spotsPerPage} />
                    <SearchSpotList
                        spots={searchedSpots}
                        isFetchingNextPage={isFetchingNextPage}
                        loadMoreRef={loadMoreRef}
                    />
                </div>
            </div>
        </div>
    );
}
