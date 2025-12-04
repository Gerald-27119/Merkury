import React, { useEffect, useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import { useBoolean } from "../../../../hooks/useBoolean";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSpotsNamesInCurrentView } from "../../../../http/spots-data";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { FaSearch } from "react-icons/fa";
import { currentViewSpotParamsActions } from "../../../../redux/current-view-spot-params";
import { currentViewSpotsActions } from "../../../../redux/current-view-spots";
import { IoClose } from "react-icons/io5";

export default function CurrentViewSpotsNameSearchBar() {
    const [searchSpotName, setSearchSpotName] = useState<string>("");
    const debounceSpotNamesHints = useDebounce(searchSpotName, 500);
    const [isShowHints, showHints, hideHints] = useBoolean();
    const [didSearch, setDidSearchTrue, setDidSearchFalse] = useBoolean();

    const { swLng, swLat, neLng, neLat, name, sorting, ratingFrom } =
        useSelectorTyped((state) => state.currentViewSpotsParams);

    const { data: spotsNames = [] } = useQuery({
        queryKey: ["currentViewSpotsNames", debounceSpotNamesHints],
        queryFn: () =>
            getSpotsNamesInCurrentView(
                swLng,
                swLat,
                neLng,
                neLat,
                debounceSpotNamesHints,
            ),
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
            queryKey: [
                "current-view-spots",
                swLng,
                swLat,
                neLng,
                neLat,
                name,
                sorting,
                ratingFrom,
            ],
        });
    };

    const handleSubmit = (newName?: string) => {
        const nameToSet =
            newName !== undefined ? newName : debounceSpotNamesHints;
        if (!didSearch) {
            dispatch(
                currentViewSpotParamsActions.setParams({
                    name: nameToSet,
                }),
            );
            setDidSearchTrue();
        } else {
            setSearchSpotName("");
            dispatch(currentViewSpotParamsActions.setParams({ name: "" }));
            setDidSearchFalse();
        }
        queryClient.removeQueries({
            queryKey: [
                "current-view-spots",
                swLng,
                swLat,
                neLng,
                neLat,
                name,
                sorting,
                ratingFrom,
            ],
        });
        dispatch(currentViewSpotsActions.clearCurrentViewSpots());
    };

    const handleHintClick = (hint: string) => {
        setSearchSpotName(hint);
        hideHints();
        handleSubmit(hint);
    };

    return (
        <div
            className="dark:text-darkText text-violetLight mt-2 flex w-full items-end justify-center space-x-3"
            data-testid="current-view-spots-name-search-bar"
        >
            <div className="relative flex w-full items-center overflow-visible">
                <div
                    className={`dark:bg-violetLight bg-whiteSmoke flex w-full items-center justify-between ${isShowHints && spotsNames?.length ? "rounded-t-3xl" : "rounded-3xl"} px-5 py-2 text-lg font-semibold drop-shadow-md dark:drop-shadow-none`}
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
                    <ul className="dark:bg-violetLight bg-whiteSmoke absolute top-full left-0 z-50 w-full overflow-hidden rounded-b-3xl text-base font-semibold">
                        {spotsNames.map((name) => (
                            <li
                                key={name}
                                className="dark:hover:bg-violetLighter cursor-pointer p-2 pl-4 hover:bg-white"
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
