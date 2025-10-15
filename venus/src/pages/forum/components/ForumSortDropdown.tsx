interface ForumSortDropdownProps<T> {
    options: T[];
    onSortChange?: (option: T) => void;
    selected?: T;
}

export default function ForumSortDropdown<T extends { name: string }>({
    options,
    onSortChange,
    selected,
}: ForumSortDropdownProps<T>) {
    return (
        <div className="mb-4 flex h-[2.5rem] items-center gap-3">
            <p>Order By:</p>
            <select
                value={JSON.stringify(selected)}
                onChange={(e) => onSortChange?.(JSON.parse(e.target.value))}
                className="dark:bg-darkBgSoft rounded-2xl p-2 shadow-lg"
            >
                {options.map((opt) => (
                    <option key={opt.name} value={JSON.stringify(opt)}>
                        {opt.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
