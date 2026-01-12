import SearchInput from "./SearchInput";
import { FaPlus, FaSearch } from "react-icons/fa";
import { MutableRefObject, useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
    getLocations,
    getSearchedSpotsOnAdvanceHomePage,
} from "../../../http/spots-data";
import AdvanceSearchSuggestions from "./AdvanceSearchSuggestions";
import HomePageSpotDto from "../../../model/interface/spot/search-spot/homePageSpotDto";
import Dropdown from "./Dropdown";
import {
    SpotSortLabels,
    SpotSortType,
} from "../../../model/enum/spot/spotSortType";
import {
    SpotRatingFilterLabels,
    SpotRatingFilterType,
} from "../../../model/enum/spot/spotRatingFilterType";
import { getUserLocation } from "../../../utils/spot-utils";
import { notificationAction } from "../../../redux/notification";
import useDispatchTyped from "../../../hooks/useDispatchTyped";

const spotRatingSortOptions = Object.values(SpotRatingFilterType).map(
    (value) => ({
        value,
        name: SpotRatingFilterLabels[value],
    }),
);

const spotSortOptions = Object.values(SpotSortType).map((value) => ({
    value,
    name: SpotSortLabels[value],
}));

interface SearchLocation {
    city?: string;
    tags?: string[];
    sort: SpotSortType;
    filter: SpotRatingFilterType;
}

const initialValue: SearchLocation = {
    city: undefined,
    tags: [],
    sort: SpotSortType.POPULARITY_DESCENDING,
    filter: SpotRatingFilterType.ANY,
};

interface SearchBarProps {
    onSetSpots: (spots: HomePageSpotDto[]) => void;
    onSetFetchingNextPage: (fetching: boolean) => void;
    loadMoreRef: MutableRefObject<HTMLDivElement | null>;
}

export default function AdvanceSearchBar({
    onSetSpots,
    loadMoreRef,
    onSetFetchingNextPage,
}: SearchBarProps) {
    const dispatch = useDispatchTyped();

    const [searchLocation, setSearchLocation] =
        useState<SearchLocation>(initialValue);
    const [userCoords, setUserCoords] = useState<{
        latitude?: number;
        longitude?: number;
    }>({});
    const [activeInput, setActiveInput] = useState<"city" | "tags" | null>();
    const [hasSearched, setHasSearched] = useState(false);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
        useInfiniteQuery({
            queryKey: ["homePageSpots", searchLocation],
            queryFn: ({ pageParam = 0 }) =>
                getSearchedSpotsOnAdvanceHomePage(
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
            enabled: hasSearched,
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
        setHasSearched(true);
        await refetch();
        setActiveInput(null);
    };

    const handleSetSort = (sort: SpotSortType) => {
        setSearchLocation((prevState) => ({
            ...prevState,
            sort,
        }));
    };

    const handleSetFilter = (filter: SpotRatingFilterType) => {
        setSearchLocation((prevState) => ({
            ...prevState,
            filter,
        }));
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
        onSetFetchingNextPage(isFetchingNextPage);
    }, [isFetchingNextPage, onSetFetchingNextPage]);

    useEffect(() => {
        if (!data) return;

        const newSpots: HomePageSpotDto[] =
            data.pages.flatMap((p) => p.items) ?? [];

        onSetSpots(newSpots);
    }, [data, onSetSpots]);

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

    return (
        <div className="flex w-full flex-col items-center gap-y-2">
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
                            {activeInput === "city" &&
                                suggestions.length > 0 && (
                                    <AdvanceSearchSuggestions
                                        suggestions={suggestions}
                                        onClick={handleSuggestionClick}
                                        id={"city"}
                                        onClose={() => setActiveInput(null)}
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
                                            prevState !== "tags"
                                                ? "tags"
                                                : null,
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
                                            onClose={() => setActiveInput(null)}
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
            <div className="flex justify-start gap-x-3 lg:w-3/4 xl:w-1/2">
                <Dropdown<SpotSortType>
                    onSelectType={handleSetSort}
                    sortOptions={spotSortOptions}
                    isSort
                />
                <Dropdown<SpotRatingFilterType>
                    onSelectType={handleSetFilter}
                    sortOptions={spotRatingSortOptions}
                />
            </div>
        </div>
    );
}
