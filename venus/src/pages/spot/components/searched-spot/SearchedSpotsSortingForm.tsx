import { RiArrowDownSLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { spotFiltersAction } from "../../../../redux/spot-filters";
import { useQueryClient } from "@tanstack/react-query";
import { searchedSpotsSliceActions } from "../../../../redux/searched-spots";
import { useBoolean } from "../../../../hooks/useBoolean";

type Option = {
    value: string;
    label: string;
};

export const options: Option[] = [
    { value: "none", label: "Default" },
    { value: "byRatingAsc", label: "Rating ascending" },
    { value: "byRatingDesc", label: "Rating descending" },
    { value: "byRatingCountAsc", label: "Rating count ascending" },
    { value: "byRatingCountDesc", label: "Rating count descending" },
];

const slideVariants = {
    hidden: { y: "-10%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "-10%", opacity: 0 },
};

export default function SearchedSpotsSortingForm() {
    const [selectedSorting, setSelectedSorting] = useState<Option>(options[0]);
    const [isDropdownOpen, _, closeDropdown, toggleDropdown] = useBoolean();

    const { name, sorting } = useSelectorTyped((state) => state.spotFilters);

    const dispatch = useDispatchTyped();

    const queryClient = useQueryClient();

    const handleSelectSorting = async (opt: Option) => {
        setSelectedSorting(opt);
        closeDropdown();
    };

    useEffect(() => {
        if (selectedSorting.value != sorting) {
            dispatch(
                spotFiltersAction.setFilters({
                    name: name,
                    sorting: selectedSorting.value,
                }),
            );
            dispatch(searchedSpotsSliceActions.clearSearchedSpots());
            queryClient.removeQueries({
                queryKey: ["spots", name, sorting],
            });
        }
    }, [selectedSorting, name, sorting, dispatch]);

    return (
        <div
            className="relative mb-6 inline-block"
            data-testid="searched-spots-sorting-form"
        >
            <div className="relative flex flex-col">
                <div
                    className={`bg-violetLight flex w-86 justify-between ${isDropdownOpen ? "rounded-t-2xl rounded-l-2xl" : "rounded-2xl"} px-5 py-1 text-lg`}
                >
                    <p className="font-semibold text-white">Sort</p>
                    <div
                        className="flex cursor-pointer items-center"
                        onClick={toggleDropdown}
                    >
                        <p className="mr-1" data-testid="sorting-value">
                            {selectedSorting.label}
                        </p>
                        <RiArrowDownSLine
                            data-testid="searched-spots-sorting-arrow"
                            className={`text-xl transition-transform duration-200 ${
                                isDropdownOpen ? "rotate-180 transform" : ""
                            }`}
                        />
                    </div>
                </div>
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.ul
                            data-testid="sorting-dropdown"
                            key="sorting-dropdown"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={slideVariants}
                            transition={{ duration: 0.2 }}
                            className="bg-violetLight absolute top-[2.28rem] right-0 z-10 mb-auto ml-auto w-fit overflow-hidden rounded-b-2xl pt-2 text-lg"
                        >
                            {options.map((opt: Option) => (
                                <li
                                    key={opt.value}
                                    value={opt.value}
                                    className="hover:bg-violetBright cursor-pointer px-3 last:pb-2"
                                    onClick={() => handleSelectSorting(opt)}
                                >
                                    {opt.label}
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
