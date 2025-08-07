interface AdvanceSearchSuggestionsProps {
    suggestions: string[];
    onClick: (key: "city" | "tags", value: string) => void;
    id: "city" | "tags";
}

export default function AdvanceSearchSuggestions({
    suggestions,
    onClick,
    id,
}: AdvanceSearchSuggestionsProps) {
    return (
        <ul className="dark:bg-darkBgSoft bg-lightBgSoft absolute z-10 mt-2 h-fit w-[200px] overflow-auto rounded-md shadow-md sm:w-[250px] md:w-[300px]">
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
