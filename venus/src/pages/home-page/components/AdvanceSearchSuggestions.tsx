import { useEffect, useRef } from "react";

interface AdvanceSearchSuggestionsProps {
    suggestions: string[];
    onClick: (key: "city" | "tags", value: string) => void;
    id: "city" | "tags";
    onClose: () => void;
}

export default function AdvanceSearchSuggestions({
    suggestions,
    onClick,
    id,
    onClose,
}: AdvanceSearchSuggestionsProps) {
    const ref = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <ul
            ref={ref}
            className="dark:bg-darkBgSoft bg-lightBgSoft absolute z-10 mt-2 h-fit w-[200px] overflow-auto rounded-md shadow-md sm:w-[250px] md:w-[300px]"
        >
            {suggestions?.map((suggestion) => (
                <li key={suggestion}>
                    <button
                        className="dark:hover:bg-violetDark hover:bg-violetLight w-full cursor-pointer px-3 py-1 text-start capitalize"
                        onClick={() => onClick(id, suggestion)}
                    >
                        {suggestion}
                    </button>
                </li>
            ))}
        </ul>
    );
}
