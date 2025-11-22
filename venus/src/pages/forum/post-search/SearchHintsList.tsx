interface SearchHintsListProps {
    hints: string[];
    onHintClick: (value: string) => void;
}

export default function SearchHintsList({
    hints,
    onHintClick,
}: SearchHintsListProps) {
    if (hints.length === 0) return null;

    return (
        <div className="dark:border-darkBorder dark:bg-darkBgSoft absolute top-full left-0 z-10 w-full rounded-md border bg-white shadow-lg">
            <ul className="py-1 text-sm">
                {hints.map((name) => (
                    <li
                        key={name}
                        className="dark:hover:bg-darkBgMuted flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => onHintClick(name)}
                    >
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
