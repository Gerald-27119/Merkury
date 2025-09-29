import { useBoolean } from "../../../hooks/useBoolean";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import {
    SpotRatingFilterType,
    SpotRatingFilterValues,
} from "../../../model/enum/spot/spotRatingFilterType";
import { ConfigProvider, Rate } from "antd";

interface DropdownProps<T> {
    onSelectType: (type: T) => void;
    sortOptions: { value: T; name: string }[];
    isSort?: boolean;
}

export default function Dropdown<T>({
    onSelectType,
    sortOptions,
    isSort,
}: DropdownProps<T>) {
    const [isOpen, _, close, toggle] = useBoolean(false);
    const [selected, setSelected] = useState(sortOptions[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const shouldRenderRatingStars = (option: { value: T; name: string }) =>
        Object.values(SpotRatingFilterType).includes(
            option.value as SpotRatingFilterType,
        ) && option.value !== SpotRatingFilterType.ANY;

    const handleSelect = (option: (typeof sortOptions)[0]) => {
        setSelected(option);
        onSelectType(option.value);
        close();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                close();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [close]);

    return (
        <div
            ref={dropdownRef}
            className={`dark:bg-darkBgSoft bg-lightBgSoft flex h-15 items-center py-1 pr-2 pl-4 shadow-md transition md:h-12 dark:shadow-black ${isOpen ? "rounded-l-full rounded-tr-full" : "rounded-full"}`}
        >
            <p>{isSort ? "Sort:" : "Filter:"}</p>
            <div className="relative inline-block w-55 text-white">
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
                            className="dark:bg-darkBgSoft bg-lightBgSoft absolute z-10 mt-1 ml-2 w-full rounded-b-md shadow-lg"
                        >
                            {sortOptions.map((option) => (
                                <li
                                    key={option.value as string}
                                    className="dark:bg-darkBgSoft bg-lightBgSoft dark:hover:bg-darkBgMuted/80 hover:bg-lightBgMuted/80 cursor-pointer transition last:rounded-b-md"
                                >
                                    <button
                                        className="flex w-full cursor-pointer items-center gap-x-3 px-4 py-2 text-start"
                                        onClick={() => handleSelect(option)}
                                    >
                                        {option.name}
                                        {shouldRenderRatingStars(option) && (
                                            <ConfigProvider
                                                theme={{
                                                    components: {
                                                        Rate: {
                                                            starBg: "#aaaaab",
                                                        },
                                                    },
                                                }}
                                            >
                                                <Rate
                                                    allowHalf
                                                    value={
                                                        SpotRatingFilterValues[
                                                            option.value as SpotRatingFilterType
                                                        ] || 0
                                                    }
                                                    disabled
                                                />
                                                <p className="-ml-2">+</p>
                                            </ConfigProvider>
                                        )}
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
