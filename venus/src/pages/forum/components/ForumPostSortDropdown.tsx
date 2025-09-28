import { ForumPostSortOption } from "../../../model/enum/forum/forumPostSortOption";

interface ForumPostSortDropdownProps {
    onSortChange: (option: ForumPostSortOption) => void;
    selected: ForumPostSortOption;
}

const options: ForumPostSortOption[] = [
    { name: "Newest", sortBy: "PUBLISH_DATE", sortDirection: "DESC" },
    { name: "Oldest", sortBy: "PUBLISH_DATE", sortDirection: "ASC" },
    { name: "Most Viewed", sortBy: "VIEWS", sortDirection: "DESC" },
    { name: "Least Viewed", sortBy: "VIEWS", sortDirection: "ASC" },
    { name: "Most Commented", sortBy: "COMMENTS", sortDirection: "DESC" },
    { name: "Least Commented", sortBy: "COMMENTS", sortDirection: "ASC" },
];

export default function ForumPostSortDropdown({
    onSortChange,
    selected,
}: ForumPostSortDropdownProps) {
    return (
        <div className="mb-4 flex h-[2.5rem] items-center gap-3">
            <p>Order By:</p>
            <select
                value={JSON.stringify(selected)}
                onChange={(e) => onSortChange(JSON.parse(e.target.value))}
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
