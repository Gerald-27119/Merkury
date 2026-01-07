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
import { IoClose } from "react-icons/io5";
import { spotDetailsModalAction } from "../../../../redux/spot-modal";
import { spotWeatherActions } from "../../../../redux/spot-weather";
import { currentViewSpotsListModalActions } from "../../../../redux/current-view-spots-list-modal";

export default function SpotsNameSearchBar() {
    const [searchSpotName, setSearchSpotName] = useState<string>("");
    const debounceSpotNamesHints = useDebounce(searchSpotName, 500);
    const [isShowHints, showHints, hideHints] = useBoolean();
    const [didSearch, setDidSearchTrue, setDidSearchFalse] = useBoolean();

    const { name, sorting } = useSelectorTyped((state) => state.spotFilters);

    const { data: spotsNames = [] } = useQuery({
        queryKey: ["spotsNames", debounceSpotNamesHints],
        queryFn: () => fetchSpotsNames(debounceSpotNamesHints),
        enabled: debounceSpotNamesHints.trim().length > 0,
    });

    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (debounceSpotNamesHints && !didSearch && searchSpotName.trim()) {
            showHints();
        } else {
            hideHints();
        }
    }, [debounceSpotNamesHints, didSearch, searchSpotName]);

    const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchSpotName(e.target.value);
        setDidSearchFalse();
        await queryClient.invalidateQueries({
            queryKey: ["spotsNames", debounceSpotNamesHints],
        });
    };

    const handleSubmit = async (newName?: string) => {
        const nameToSet =
            newName !== undefined ? newName : debounceSpotNamesHints;
        if (!didSearch) {
            dispatch(spotFiltersAction.setFilters({ name: nameToSet }));
            setDidSearchTrue();
        } else {
            setSearchSpotName("");
            dispatch(spotFiltersAction.setFilters({ name: "" }));
            setDidSearchFalse();
        }
        await queryClient.invalidateQueries({
            queryKey: ["spots", "filter", nameToSet],
        });
        queryClient.removeQueries({
            queryKey: ["spots", name, sorting],
        });
        dispatch(spotDetailsModalAction.handleCloseModal());
        dispatch(spotWeatherActions.closeAllWeatherModals());
        dispatch(
            currentViewSpotsListModalActions.closeCurrentViewSpotsListModal(),
        );
        dispatch(searchedSpotListModalAction.handleOpenList());
        dispatch(searchedSpotsSliceActions.clearSearchedSpots());
    };

    const handleHintClick = async (hint: string) => {
        setSearchSpotName(hint);
        hideHints();
        await handleSubmit(hint);
    };

    return (
        <div className="dark:text-darkText text-violetLight mt-2 flex items-end justify-center space-x-3">
            <div className="relative flex items-center">
                <div
                    className={`dark:bg-violetDarker bg-fifth flex w-96 items-center justify-between ${isShowHints && spotsNames?.length ? "rounded-t-3xl" : "rounded-3xl"} px-5 py-2 text-lg font-semibold drop-shadow-md dark:drop-shadow-none`}
                >
                    <input
                        className="dark:placeholder-darkText placeholder-violetLight w-full focus:outline-none"
                        id="name"
                        data-testid="search-input"
                        autoComplete="off"
                        type="text"
                        placeholder="Search on map"
                        onBlur={() => hideHints()}
                        value={searchSpotName}
                        onChange={handleNameChange}
                    />
                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="cursor-pointer"
                    >
                        {didSearch && debounceSpotNamesHints ? (
                            <IoClose className="text-2xl" />
                        ) : (
                            <FaSearch
                                className="text-xl"
                                data-testid="search-icon"
                            />
                        )}
                    </button>
                </div>
                {isShowHints && spotsNames.length > 0 && (
                    <ul className="dark:bg-violetDarker bg-fifth absolute top-full left-0 w-full overflow-hidden rounded-b-3xl text-base font-semibold">
                        {spotsNames.map((name) => (
                            <li
                                key={name}
                                className="dark:hover:bg-violetDark hover:bg-whiteSmoke cursor-pointer p-2 pl-4"
                                onMouseDown={() => handleHintClick(name)}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
