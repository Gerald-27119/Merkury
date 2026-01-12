import SearchInput from "./SearchInput";
import { FaSearch } from "react-icons/fa";
import { MutableRefObject, useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
    country?: string;
    region?: string;
    city?: string;
}

const initialValue = {
    country: undefined,
    region: undefined,
    city: undefined,
};

interface SearchBarProps {
    onSetSpots: (spots: HomePageSpotDto[]) => void;
    onSetFetchingNextPage: (fetching: boolean) => void;
    loadMoreRef: MutableRefObject<HTMLDivElement | null>;
}

export default function SearchBar({
    onSetSpots,
    loadMoreRef,
    onSetFetchingNextPage,
}: SearchBarProps) {
    const dispatch = useDispatchTyped();

    const [userCoords, setUserCoords] = useState<{
        latitude?: number;
        longitude?: number;
    }>({});
    const [searchLocation, setSearchLocation] =
        useState<SearchLocation>(initialValue);
    const [activeInput, setActiveInput] = useState<LocationKey | null>(null);

    const { fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
        useInfiniteQuery({
            queryKey: ["homePageSpots", searchLocation],
            queryFn: ({ pageParam = 0 }) =>
                getSearchedSpotsOnHomePage(
                    {
                        ...searchLocation,
                        userLongitude: userCoords.longitude,
                        userLatitude: userCoords.latitude,
                    },
                    pageParam,
                    6,
                ),
            getNextPageParam: (lastPage, allPages) =>
                lastPage.hasNext ? allPages.length : undefined,
            initialPageParam: 0,
            enabled: false,
        });

    const { data: suggestions = [] } = useQuery({
        queryKey: [
            "locations",
            activeInput,
            searchLocation[activeInput ?? "country"],
        ],
        queryFn: () =>
            getLocations(
                searchLocation[activeInput ?? "country"] ?? "",
                activeInput ?? "country",
            ),
        enabled:
            !!activeInput && (searchLocation[activeInput] ?? "").length >= 2,
        staleTime: 5 * 60 * 1000,
    });

    const handleSetLocation = (key: LocationKey, value: string | undefined) => {
        setSearchLocation((prev) => {
            let updated = {
                ...prev,
                [key]: value && value.trim() !== "" ? value : undefined,
            };

            if (key === "country") {
                updated.region = undefined;
                updated.city = undefined;
            } else if (key === "region") {
                updated.city = undefined;
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
        const result = await refetch();
        onSetSpots(result.data?.pages[0]?.items ?? []);
        setActiveInput(null);
    };

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage().then((res) => {
                        onSetSpots(
                            res.data?.pages.flatMap((p) => p.items) ?? [],
                        );
                    });
                }
            },
            { threshold: 1.0 },
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, onSetSpots]);

    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                const coords = await getUserLocation();
                setUserCoords(coords);
            } catch (err) {
                dispatch(
                    notificationAction.addInfo({
                        message:
                            "You must turn on location to display how far spots are.",
                    }),
                );
            }
        };

        fetchUserLocation();
    }, [dispatch]);

    useEffect(() => {
        onSetFetchingNextPage(isFetchingNextPage);
    }, [isFetchingNextPage, onSetFetchingNextPage]);

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
                                value={searchLocation[id] ?? ""}
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
                                    onClose={() => setActiveInput(null)}
                                />
                            )}
                        </div>
                    ))}
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
