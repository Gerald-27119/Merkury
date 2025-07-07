import { useState } from "react";
import { DateSortType } from "../model/enum/account/photos/dateSortType";
import { Dayjs } from "dayjs";
import { notificationAction } from "../redux/notification";
import useDispatchTyped from "./useDispatchTyped";

export function useDateSortFilter() {
    const [sortType, setSortType] = useState(DateSortType.DATE_DECREASE);
    const [searchDate, setSearchDate] = useState<{
        from: string | null;
        to: string | null;
    }>({ from: null, to: null });
    const dispatch = useDispatchTyped();

    const handleSelectType = (type: DateSortType) => {
        setSortType(type);
    };

    const handleChangeDate = (value: Dayjs | null, key: "from" | "to") => {
        const formatted = value?.format("YYYY-MM-DD");

        if (key === "from" && searchDate.to && value?.isAfter(searchDate.to)) {
            dispatch(
                notificationAction.setError({
                    message: '"From" date cannot be after "To" date',
                }),
            );
            return;
        }

        if (
            key === "to" &&
            searchDate.from &&
            value?.isBefore(searchDate.from)
        ) {
            dispatch(
                notificationAction.setError({
                    message: '"To" date cannot be before "From" date',
                }),
            );
            return;
        }

        setSearchDate((prev) => ({ ...prev, [key]: formatted }));
    };

    return {
        sortType,
        searchDate,
        handleSelectType,
        handleChangeDate,
    };
}
