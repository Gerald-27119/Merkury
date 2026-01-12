import { LocationKey } from "./SearchBar";
import { useEffect, useRef } from "react";

interface SearchSuggestionsProps {
    suggestions: string[];
    onClick: (key: LocationKey, value: string) => void;
    id: LocationKey;
    onClose: () => void;
}

export default function SearchSuggestions({
    suggestions,
    onClick,
    id,
    onClose,
}: SearchSuggestionsProps) {
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
            className="dark:bg-darkBgSoft bg-lightBgSoft absolute z-10 max-h-40 w-full overflow-auto rounded-md shadow-md"
        >
            {suggestions?.map((suggestion) => (
                <li key={suggestion}>
                    <button
                        className="dark:hover:bg-violetDark hover:bg-violetLight w-full cursor-pointer px-3 py-1 text-start"
                        onClick={() => onClick(id, suggestion)}
                    >
                        {suggestion}
                    </button>
                </li>
            ))}
        </ul>
    );
}
