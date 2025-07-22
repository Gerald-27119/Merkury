import { RiArrowDownSLine } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useBoolean } from "../../../hooks/useBoolean";
import SpotSortingOption from "../../../model/spotSortingOption";
import { SpotSortingFormVariantType } from "../../../model/enum/spot/spotSortingFormVariantType";

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
    queryKeyToRemoveQueries: any[];
    onClear: () => void;
    onSelectSorting: (opt: SpotSortingOption) => void;
    sorting: string;
    variant: SpotSortingFormVariantType;
};

export default function SpotsSortingForm({
    queryKeyToRemoveQueries,
    onClear,
    onSelectSorting,
    sorting,
    variant,
}: SearchedSpotsSortingFormProps) {
    const isSearchVariant: boolean =
        variant === SpotSortingFormVariantType.SEARCH;
    const mainWrapperClasses: string = `relative ${isSearchVariant && "mb-6"} inline-block`;
    const bgContainerClasses: string = `bg-violetLight flex ${isSearchVariant ? "w-86 px-5" : "w-36 pl-2.5"} justify-between py-1 text-lg`;
    const openedDropdownClasses: string = `${isSearchVariant ? "rounded-t-2xl rounded-l-2xl" : "rounded-t-2xl"}`;
    const paragraphLabelClasses: string = `mr-2 font-semibold text-white ${!isSearchVariant && "ml-0"}`;
    const wrapperContainerClasses: string = `flex ${!isSearchVariant && "overflow-hidden"} cursor-pointer items-center`;
    const valueClasses: string = `${isSearchVariant ? "mr-1" : "mr-2.5 h-7 w-1/2"}`;

    const [selectedSorting, setSelectedSorting] = useState<SpotSortingOption>(
        options[0],
    );
    const [isDropdownOpen, _, closeDropdown, toggleDropdown] = useBoolean();

    const queryClient = useQueryClient();

    const handleSelectSorting = (opt: SpotSortingOption) => {
        setSelectedSorting(opt);
        closeDropdown();
    };

    const stableQKey = useMemo(
        () => queryKeyToRemoveQueries,
        [queryKeyToRemoveQueries],
    );

    useEffect(() => {
        if (selectedSorting.value != sorting) {
            onSelectSorting(selectedSorting);
            onClear();
            queryClient.removeQueries({
                queryKey: queryKeyToRemoveQueries,
            });
        }
    }, [selectedSorting, sorting, stableQKey]);

    return (
        <div
            className={mainWrapperClasses}
            data-testid="searched-spots-sorting-form"
        >
            <div className="relative flex flex-col">
                <div
                    className={`${bgContainerClasses} ${isDropdownOpen ? openedDropdownClasses : "rounded-2xl"}`}
                >
                    <p className={paragraphLabelClasses}>Sort:</p>
                    <div
                        className={wrapperContainerClasses}
                        onClick={toggleDropdown}
                    >
                        <p className={valueClasses} data-testid="sorting-value">
                            {selectedSorting.label}
                        </p>
                        <RiArrowDownSLine
                            data-testid="searched-spots-sorting-arrow"
                            className={`mx-auto text-xl transition-transform duration-200 ${
                                isDropdownOpen && "rotate-180 transform"
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
                            className="bg-violetLight absolute top-[2.25rem] right-0 z-10 mb-auto ml-auto w-fit overflow-hidden rounded-b-2xl pt-2 text-lg"
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
