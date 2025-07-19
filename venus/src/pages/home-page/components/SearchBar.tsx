import SearchInput from "./SearchInput";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getSearchedSpotsOnHomePage } from "../../../http/spots-data";
import SearchSpotDto from "../../../model/interface/spot/search-spot/searchSpotDto";

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

type LocationKey = (typeof inputList)[number]["id"];

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
    onSetSpots: (spots: SearchSpotDto[]) => void;
}

export default function SearchBar({ onSetSpots }: SearchBarProps) {
    const { mutateAsync } = useMutation({
        mutationFn: getSearchedSpotsOnHomePage,
    });

    const [searchLocation, setSearchLocation] =
        useState<SearchLocation>(initialValue);

    const handleSetLocation = (key: LocationKey, value: string) => {
        setSearchLocation((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSearchSpots = async () => {
        onSetSpots(await mutateAsync(searchLocation));
        setSearchLocation(initialValue);
    };

    return (
        <div className="dark:bg-darkBgSoft flex w-1/2 items-center justify-between space-x-3 rounded-md px-3 py-2 shadow-md dark:shadow-black">
            <div className="flex w-full flex-col space-y-2">
                <h1>Location</h1>
                <div className="flex w-full space-x-2">
                    {inputList.map((i) => (
                        <SearchInput
                            key={i.id}
                            label={i.label}
                            id={i.id}
                            value={searchLocation[i.id]}
                            onChange={(event) =>
                                handleSetLocation(i.id, event.target.value)
                            }
                        />
                    ))}
                </div>
            </div>
            <button
                className="dark:bg-darkBgMuted dark:hover:bg-darkBgMuted/80 cursor-pointer rounded-md p-2"
                onClick={handleSearchSpots}
            >
                <FaSearch />
            </button>
        </div>
    );
}
