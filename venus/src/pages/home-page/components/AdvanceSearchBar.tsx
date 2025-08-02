import SearchInput from "./SearchInput";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSearchedSpotsOnHomePage } from "../../../http/spots-data";
import SearchSpotDto from "../../../model/interface/spot/search-spot/searchSpotDto";
import SpotTagDto from "../../../model/interface/spot/tag/spotTagDto";
import AdvanceSearchSuggestions from "./AdvanceSearchSuggestions";

interface SearchLocation {
    city: string;
    tags: SpotTagDto[];
}

const initialValue = {
    city: "",
    tags: [],
};

interface SearchBarProps {
    onSetSpots: (spots: SearchSpotDto[]) => void;
}

export default function AdvanceSearchBar({ onSetSpots }: SearchBarProps) {
    const [searchLocation, setSearchLocation] =
        useState<SearchLocation>(initialValue);
    const [activeInput, setActiveInput] = useState<"city" | "tags" | null>();

    const { mutateAsync } = useMutation({
        mutationFn: getSearchedSpotsOnHomePage,
    });

    const { data: suggestions = [] } = useQuery({
        queryKey: [
            "locations",
            activeInput,
            searchLocation[activeInput ?? "city"],
        ],
        queryFn: () => {},
        enabled: !!activeInput && searchLocation[activeInput].length >= 2,
        staleTime: 5 * 60 * 1000,
    });

    const handleSetLocation = (key: "city" | "tags", value: string) => {
        setSearchLocation((prev) => ({ ...prev, [key]: value }));
        setActiveInput(key);
    };

    const handleSuggestionClick = (key: "city" | "tags", value: string) => {
        setSearchLocation((prev) => ({ ...prev, [key]: value }));
        setActiveInput(null);
    };

    const handleSearchSpots = async () => {
        const spots = await mutateAsync(searchLocation);
        onSetSpots(spots);
        setSearchLocation(initialValue);
        setActiveInput(null);
    };

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft flex w-full flex-col items-center justify-between space-y-3 rounded-md px-3 py-2 shadow-md md:flex-row md:space-y-0 lg:w-3/4 lg:space-x-3 xl:w-1/2 dark:shadow-black">
            <div className="flex w-full space-y-2">
                <div className="flex w-full flex-col">
                    <h1>Location</h1>
                    <div className="relative w-full pt-2">
                        <SearchInput
                            label="Your city"
                            id="city"
                            value={searchLocation["city"]}
                            onChange={(e) =>
                                handleSetLocation("city", e.target.value)
                            }
                            onFocus={() => setActiveInput("city")}
                        />
                        {activeInput === "city" && suggestions.length > 0 && (
                            <AdvanceSearchSuggestions
                                suggestions={suggestions}
                                onClick={handleSuggestionClick}
                                id={"city"}
                            />
                        )}
                    </div>
                </div>
                <div className="flex w-full flex-col">
                    <h1 className="pointer-events-none capitalize">Tags</h1>
                    <div className="border-l-darkBorder my-2 h-full w-full border-l pl-4">
                        <button className="dark:bg-darkBgMuted dark:hover:bg-darkBgMuted/80 bg-lightBgMuted hover:bg-lightBgMuted/80 flex w-full cursor-pointer justify-center rounded-md p-2 md:w-fit">
                            <FaPlus />
                        </button>
                    </div>
                </div>
            </div>
            <button
                className="dark:bg-darkBgMuted dark:hover:bg-darkBgMuted/80 bg-lightBgMuted hover:bg-lightBgMuted/80 flex w-full cursor-pointer justify-center rounded-md p-2 md:w-fit"
                onClick={handleSearchSpots}
                disabled={!searchLocation.city || !searchLocation.tags}
            >
                <FaSearch />
            </button>
        </div>
    );
}
