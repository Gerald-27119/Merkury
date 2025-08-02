import { LocationKey } from "./SearchBar";

interface AdvanceSearchSuggestionsProps {
    suggestions: string[];
    onClick: (key: "city" | "tags", value: string) => void;
    id: LocationKey;
}

export default function AdvanceSearchSuggestions({
    suggestions,
    onClick,
    id,
}: AdvanceSearchSuggestionsProps) {
    return (
        <ul className="dark:bg-darkBgSoft bg-lightBgSoft absolute z-10 max-h-40 w-full overflow-auto rounded-md shadow-md">
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
