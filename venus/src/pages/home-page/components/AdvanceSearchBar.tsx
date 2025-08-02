import SearchInput from "./SearchInput";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getLocations,
    getSearchedSpotsOnAdvanceHomePage,
} from "../../../http/spots-data";
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
        mutationFn: getSearchedSpotsOnAdvanceHomePage,
    });

    const { data: suggestions = [] } = useQuery({
        queryKey: ["locations", "advance", activeInput],
        queryFn: () =>
            getLocations(
                activeInput === "tags" ? "" : searchLocation.city,
                activeInput ?? "city",
            ),
        enabled:
            !!activeInput &&
            (activeInput === "tags" || searchLocation.city.length >= 2),
        staleTime: 5 * 60 * 1000,
    });

    const handleSetCity = (value: string) => {
        setSearchLocation((prev) => ({ ...prev, city: value }));
        setActiveInput("city");
    };

    const handleSuggestionClick = (key: "city" | "tags", value: string) => {
        if (key === "tags") {
            setSearchLocation((prev) => {
                const tagExists = prev.tags.find((tag) => tag.name === value);
                if (tagExists) return prev;
                return {
                    ...prev,
                    tags: [...prev.tags, { name: value }],
                };
            });
        } else {
            setSearchLocation((prev) => ({ ...prev, [key]: value }));
        }
        setActiveInput(null);
    };

    const handleSearchSpots = async () => {
        const spots = await mutateAsync(searchLocation);
        onSetSpots(spots);
        setSearchLocation(initialValue);
        setActiveInput(null);
    };

    console.log(searchLocation);

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft flex w-full flex-col items-center justify-between space-y-3 rounded-md px-3 py-2 shadow-md md:flex-row md:space-y-0 lg:w-3/4 lg:space-x-3 xl:w-1/2 dark:shadow-black">
            <div className="flex w-full">
                <div className="flex w-full flex-col">
                    <h1>Location</h1>
                    <div className="relative w-full pt-2">
                        <SearchInput
                            label="Your city"
                            id="city"
                            value={searchLocation["city"]}
                            onChange={(e) => handleSetCity(e.target.value)}
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
                    <div className="border-l-darkBorder my-2 flex h-full w-full space-x-2 border-l pl-4">
                        <div className="relative w-full">
                            <button
                                className="dark:bg-darkBgMuted dark:hover:bg-darkBgMuted/80 bg-lightBgMuted hover:bg-lightBgMuted/80 flex w-full cursor-pointer justify-center rounded-md p-2 md:w-fit"
                                onClick={() =>
                                    setActiveInput((prevState) =>
                                        prevState !== "tags" ? "tags" : null,
                                    )
                                }
                            >
                                <FaPlus />
                            </button>
                            {activeInput === "tags" &&
                                suggestions.length > 0 && (
                                    <AdvanceSearchSuggestions
                                        suggestions={suggestions}
                                        onClick={handleSuggestionClick}
                                        id={"tags"}
                                    />
                                )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {searchLocation.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="dark:bg-darkBgMuted dark:hover:bg-darkBgMuted/80 bg-lightBgMuted hover:bg-lightBgMuted/80 flex w-fit cursor-pointer justify-center rounded-md px-2 py-1 capitalize"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
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
