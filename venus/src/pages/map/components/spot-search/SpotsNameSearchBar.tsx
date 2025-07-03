import { useQuery, useQueryClient } from "@tanstack/react-query";
import { spotFiltersAction } from "../../../../redux/spot-filters";
import React, { useEffect, useState } from "react";
import { fetchSpotsNames } from "../../../../http/spots-data";
import useDebounce from "../../../../hooks/useDebounce.jsx";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { FaSearch } from "react-icons/fa";
import { searchedSpotListModalAction } from "../../../../redux/searched-spot-list-modal";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { searchedSpotsSliceActions } from "../../../../redux/searched-spots";
import { useBoolean } from "../../../../hooks/useBoolean";

export default function SpotsNameSearchBar() {
    const [searchSpotName, setSearchSpotName] = useState<string>("");
    const debounceSpotNamesHints = useDebounce(searchSpotName, 500);
    const [isShowHints, showHints, hideHints, _] = useBoolean();

    const { name, sorting } = useSelectorTyped((state) => state.spotFilters);

    const { data: spotsNames = [] } = useQuery({
        queryKey: ["spotsNames", debounceSpotNamesHints],
        queryFn: () => fetchSpotsNames(debounceSpotNamesHints),
        enabled: debounceSpotNamesHints.trim().length > 0,
    });

    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (debounceSpotNamesHints) {
            showHints();
        } else {
            hideHints();
        }
    }, [debounceSpotNamesHints]);

    const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchSpotName(e.target.value);
        await queryClient.invalidateQueries({
            queryKey: ["spotsNames", debounceSpotNamesHints],
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(spotFiltersAction.setFilters({ name: searchSpotName }));
        queryClient.invalidateQueries({
            queryKey: ["spots", "filter", debounceSpotNamesHints],
        });
        queryClient.removeQueries({
            queryKey: ["spots", name, sorting],
        });
        dispatch(searchedSpotListModalAction.handleOpenList());
        dispatch(searchedSpotsSliceActions.clearSearchedSpots());
    };

    const handleHintClick = (hint: string) => {
        setSearchSpotName(hint);
        hideHints();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="dark:text-darkText mt-2 flex items-end justify-center space-x-3"
        >
            <div className="relative flex items-center">
                <div
                    className={`dark:bg-violetDarker flex w-96 items-center justify-between ${isShowHints && spotsNames?.length ? "rounded-t-3xl" : "rounded-3xl"} px-5 py-2 text-lg font-semibold`}
                >
                    <input
                        className="dark:placeholder-darkText w-full focus:outline-none"
                        id="name"
                        data-testid="search-input"
                        autoComplete="off"
                        type="text"
                        placeholder="Search on map"
                        onBlur={() => hideHints()}
                        value={searchSpotName}
                        onChange={handleNameChange}
                    />
                    <button type="submit" className="cursor-pointer text-xl">
                        <FaSearch data-testid="search-icon" />
                    </button>
                </div>
                {isShowHints && spotsNames.length > 0 && (
                    <ul className="dark:bg-violetDarker absolute top-full left-0 w-full overflow-hidden rounded-b-3xl text-base font-semibold">
                        {spotsNames.map((name) => (
                            <li
                                key={name}
                                className="dark:hover:bg-violetDark ml-3 cursor-pointer p-2"
                                onMouseDown={() => handleHintClick(name)}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </form>
    );
}
