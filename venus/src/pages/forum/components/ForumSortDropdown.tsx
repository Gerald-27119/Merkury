interface ForumSortDropdownProps<T> {
    options: T[];
    onSortChange?: (option: T) => void;
    selected?: T;
    disabled?: boolean;
}

export default function ForumSortDropdown<T extends { name: string }>({
    options,
    onSortChange,
    selected,
    disabled = false,
}: ForumSortDropdownProps<T>) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!disabled) {
            onSortChange?.(JSON.parse(e.target.value));
        }
    };

    return (
        <div className="mb-4 flex h-[2.5rem] items-center gap-3">
            <p>Order By:</p>
            <select
                value={JSON.stringify(selected)}
                disabled={disabled}
                onChange={handleChange}
                className={`dark:bg-darkBgSoft bg-lightBgSoft rounded-2xl p-2 shadow-lg ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} `}
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
