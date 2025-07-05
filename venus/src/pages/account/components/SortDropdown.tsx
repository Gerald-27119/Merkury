import { DateSortType } from "../../../model/enum/account/photos/dateSortType";
import { useState } from "react";
import { useBoolean } from "../../../hooks/useBoolean";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

const sortOptions = [
    { value: DateSortType.DATE_DECREASE, name: "Date descending" },
    { value: DateSortType.DATE_INCREASE, name: "Date ascending" },
];

interface DropdownProps {
    onSelectType: (type: DateSortType) => void;
}

export default function SortDropdown({ onSelectType }: DropdownProps) {
    const [isOpen, _, close, toggle] = useBoolean(false);
    const [selected, setSelected] = useState(sortOptions[0]);

    const handleSelect = (option: (typeof sortOptions)[0]) => {
        setSelected(option);
        onSelectType(option.value);
        close();
    };

    return (
        <div
            className={`bg-violetDark flex h-15 items-center px-2 py-1 transition md:h-12 ${isOpen ? "rounded-l-full rounded-tr-full" : "rounded-full"}`}
        >
            <p>Sort:</p>
            <div className="relative inline-block w-44 text-white">
                <button
                    onClick={toggle}
                    className="flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 text-left"
                >
                    {selected.name}
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-2"
                    >
                        <IoIosArrowDown />
                    </motion.span>
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="bg-violetDark absolute z-10 mt-1 ml-2 w-full rounded-b-md shadow-lg"
                        >
                            {sortOptions.map((option) => (
                                <li
                                    key={option.value}
                                    className="hover:bg-violetLight cursor-pointer transition last:rounded-b-md"
                                >
                                    <button
                                        className="w-full cursor-pointer px-4 py-2 text-start"
                                        onClick={() => handleSelect(option)}
                                    >
                                        {option.name}
                                    </button>
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
