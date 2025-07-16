import { RiArrowDownSLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useBoolean } from "../../../hooks/useBoolean";
import SpotSortingOption from "../../../model/spotSortingOption";

export const options: SpotSortingOption[] = [
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

type SearchedSpotsSortingFormProps = {
    queryKeyToRemoveQueries: string[];
    onClear: () => void;
    onSelectSorting: (opt: SpotSortingOption) => void;
    sorting: string;
};

export default function SpotsSortingForm({
    queryKeyToRemoveQueries,
    onClear,
    onSelectSorting,
    sorting,
}: SearchedSpotsSortingFormProps) {
    const [selectedSorting, setSelectedSorting] = useState<SpotSortingOption>(
        options[0],
    );
    const [isDropdownOpen, _, closeDropdown, toggleDropdown] = useBoolean();

    const queryClient = useQueryClient();

    const handleSelectSorting = (opt: SpotSortingOption) => {
        setSelectedSorting(opt);
        closeDropdown();
    };

    useEffect(() => {
        if (selectedSorting.value != sorting) {
            onSelectSorting(selectedSorting);
            onClear();
            queryClient.removeQueries({
                queryKey: queryKeyToRemoveQueries,
            });
        }
    }, [selectedSorting, sorting, ...queryKeyToRemoveQueries]);

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
                            {options.map((opt: SpotSortingOption) => (
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
