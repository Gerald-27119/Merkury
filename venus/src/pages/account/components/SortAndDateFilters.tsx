import SortDropdown from "../components/SortDropdown";
import DateChooser from "../components/DateChooser";
import dayjs, { Dayjs } from "dayjs";

interface SortAndDateFiltersProps {
    onSortChange: (type: any) => void;
    onDateChange: (value: Dayjs | null, id: "from" | "to") => void;
    from: string | null;
    to: string | null;
}

export default function SortAndDateFilters({
    onSortChange,
    onDateChange,
    from,
    to,
}: SortAndDateFiltersProps) {
    return (
        <div className="text-darkText flex flex-wrap space-y-3 space-x-3 md:space-y-0 lg:mx-27">
            <SortDropdown onSelectType={onSortChange} />
            <div className="bg-violetDark flex h-15 items-center space-x-3 rounded-full px-2.5 py-1 md:h-12">
                <DateChooser
                    text="From:"
                    onChange={(val) => onDateChange(val, "from")}
                    value={from ? dayjs(from) : null}
                />
                <DateChooser
                    text="To:"
                    onChange={(val) => onDateChange(val, "to")}
                    value={to ? dayjs(to) : null}
                />
            </div>
        </div>
    );
}
