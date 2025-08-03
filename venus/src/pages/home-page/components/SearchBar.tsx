import SearchInput from "./SearchInput";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getLocations,
    getSearchedSpotsOnHomePage,
} from "../../../http/spots-data";
import SearchSuggestions from "./SearchSuggestions";
import HomePageSpotDto from "../../../model/interface/spot/search-spot/homePageSpotDto";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { getUserLocation } from "../../../utils/spot-utils";
import { notificationAction } from "../../../redux/notification";

const inputList = [
    {
        label: "Your Country",
        id: "country",
    },
    {
        label: "Your Region",
        id: "region",
    },
    {
        label: "Your City",
        id: "city",
    },
] as const;

export type LocationKey = (typeof inputList)[number]["id"];

interface SearchLocation {
    country: string;
    region: string;
    city: string;
}

const initialValue = {
    country: "",
    region: "",
    city: "",
};

interface SearchBarProps {
    onSetSpots: (spots: HomePageSpotDto[]) => void;
}

export default function SearchBar({ onSetSpots }: SearchBarProps) {
    const dispatch = useDispatchTyped();

    const [searchLocation, setSearchLocation] =
        useState<SearchLocation>(initialValue);
    const [activeInput, setActiveInput] = useState<LocationKey | null>(null);

    const { mutateAsync } = useMutation({
        mutationFn: getSearchedSpotsOnHomePage,
    });

    const { data: suggestions = [] } = useQuery({
        queryKey: [
            "locations",
            activeInput,
            searchLocation[activeInput ?? "country"],
        ],
        queryFn: () =>
            getLocations(
                searchLocation[activeInput ?? "country"],
                activeInput ?? "country",
            ),
        enabled: !!activeInput && searchLocation[activeInput].length >= 2,
        staleTime: 5 * 60 * 1000,
    });

    const handleSetLocation = (key: LocationKey, value: string) => {
        setSearchLocation((prev) => {
            let updated = { ...prev, [key]: value };

            if (key === "country") {
                updated.region = "";
                updated.city = "";
            } else if (key === "region") {
                updated.city = "";
            }

            return updated;
        });

        setActiveInput(key);
    };

    const handleSuggestionClick = (key: LocationKey, value: string) => {
        setSearchLocation((prev) => ({ ...prev, [key]: value }));
        setActiveInput(null);
    };

    const handleSearchSpots = async () => {
        let coords;

        try {
            coords = await getUserLocation();
        } catch (err) {
            dispatch(
                notificationAction.setInfo({
                    message:
                        "You must turn on location to display how far spots are.",
                }),
            );
        }

        const spots = await mutateAsync({
            ...searchLocation,
            userLongitude: coords?.longitude,
            userLatitude: coords?.latitude,
        });
        onSetSpots(spots);
        setActiveInput(null);
    };

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft flex w-full flex-col items-center justify-between space-y-3 rounded-md px-3 py-2 shadow-md md:flex-row md:space-y-0 lg:w-3/4 lg:space-x-3 xl:w-1/2 dark:shadow-black">
            <div className="flex w-full flex-col space-y-2">
                <h1>Location</h1>
                <div className="flex w-full flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2">
                    {inputList.map(({ id, label }) => (
                        <div key={id} className="relative w-full">
                            <SearchInput
                                label={label}
                                id={id}
                                value={searchLocation[id]}
                                onChange={(e) =>
                                    handleSetLocation(id, e.target.value)
                                }
                                onFocus={() => setActiveInput(id)}
                            />
                            {activeInput === id && suggestions.length > 0 && (
                                <SearchSuggestions
                                    suggestions={suggestions}
                                    onClick={handleSuggestionClick}
                                    id={id}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <button
                className="dark:bg-darkBgMuted dark:hover:bg-darkBgMuted/80 bg-lightBgMuted hover:bg-lightBgMuted/80 flex w-full cursor-pointer justify-center rounded-md p-2 md:w-fit"
                onClick={handleSearchSpots}
                disabled={
                    !searchLocation.city ||
                    !searchLocation.region ||
                    !searchLocation.country
                }
            >
                <FaSearch />
            </button>
        </div>
    );
}
