import SearchInput from "./SearchInput";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getLocations,
    getSearchedSpotsOnAdvanceHomePage,
} from "../../../http/spots-data";
import AdvanceSearchSuggestions from "./AdvanceSearchSuggestions";
import HomePageSpotDto from "../../../model/interface/spot/search-spot/homePageSpotDto";

interface SearchLocation {
    city?: string;
    tags?: string[];
}

const initialValue = {
    city: undefined,
    tags: [],
};

interface SearchBarProps {
    onSetSpots: (spots: HomePageSpotDto[]) => void;
}

export default function AdvanceSearchBar({ onSetSpots }: SearchBarProps) {
    const [searchLocation, setSearchLocation] =
        useState<SearchLocation>(initialValue);
    const [activeInput, setActiveInput] = useState<"city" | "tags" | null>();

    const { mutateAsync } = useMutation({
        mutationFn: getSearchedSpotsOnAdvanceHomePage,
    });

    const { data: suggestions = [] } = useQuery({
        queryKey: [
            "locations",
            "advance",
            activeInput,
            searchLocation[activeInput ?? "city"],
        ],
        queryFn: () =>
            getLocations(
                activeInput === "tags" ? "" : searchLocation.city,
                activeInput ?? "city",
            ),
        enabled:
            activeInput === "tags" || (searchLocation.city?.length ?? 0) >= 2,
        staleTime: 5 * 60 * 1000,
    });

    const handleSetCity = (value: string | undefined) => {
        setSearchLocation((prev) => ({
            ...prev,
            city: value && value.trim() !== "" ? value : undefined,
        }));
        setActiveInput("city");
    };

    const handleSuggestionClick = (key: "city" | "tags", value: string) => {
        if (key === "tags") {
            setSearchLocation((prev) => {
                const tagExists = (prev.tags ?? []).find(
                    (tag) => tag === value,
                );
                if (tagExists) return prev;
                return {
                    ...prev,
                    tags: [...(prev.tags ?? []), value],
                };
            });
        } else {
            setSearchLocation((prev) => ({ ...prev, [key]: value }));
        }
        setActiveInput(null);
    };

    const handleRemoveTag = (value: string) => {
        setSearchLocation((prevState) => ({
            ...prevState,
            tags: [...(prevState.tags ?? []).filter((t) => t !== value)],
        }));
    };

    const handleSearchSpots = async () => {
        const spots = await mutateAsync(searchLocation);
        onSetSpots(spots);
        setActiveInput(null);
    };

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft flex w-full flex-col items-center justify-between space-y-3 rounded-md px-3 py-2 shadow-md md:flex-row md:space-y-0 lg:w-3/4 lg:space-x-3 xl:w-1/2 dark:shadow-black">
            <div className="flex w-full">
                <div className="flex w-full flex-col">
                    <h1>Location</h1>
                    <div className="relative w-full pt-2">
                        <SearchInput
                            label="Your city"
                            id="city"
                            value={searchLocation["city"] ?? ""}
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
                    <div className="border-l-darkBorder my-2 flex h-full w-full justify-start space-x-2 border-l pl-4">
                        <div className="relative">
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
                        {searchLocation.tags?.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleRemoveTag(tag)}
                                className="dark:bg-darkBgMuted dark:hover:bg-darkBgMuted/80 bg-lightBgMuted hover:bg-lightBgMuted/80 flex w-fit cursor-pointer justify-center rounded-md px-2 py-1 capitalize"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <button
                className="dark:bg-darkBgMuted dark:hover:bg-darkBgMuted/80 bg-lightBgMuted hover:bg-lightBgMuted/80 flex w-full cursor-pointer justify-center rounded-md p-2 md:w-fit"
                onClick={handleSearchSpots}
            >
                <FaSearch />
            </button>
        </div>
    );
}
