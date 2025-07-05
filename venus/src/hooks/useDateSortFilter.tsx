import { useState } from "react";
import { PhotosSortType } from "../model/enum/account/photos/photosSortType";
import { Dayjs } from "dayjs";
import { notificationAction } from "../redux/notification";
import useDispatchTyped from "./useDispatchTyped";

export function useDateSortFilter() {
    const [sortType, setSortType] = useState(PhotosSortType.DATE_DECREASE);
    const [searchDate, setSearchDate] = useState<{
        from: string | null;
        to: string | null;
    }>({ from: null, to: null });
    const dispatch = useDispatchTyped();

    const handleSelectType = (type: PhotosSortType) => {
        setSortType(type);
    };

    const handleChangeDate = (value: Dayjs | null, id: "from" | "to") => {
        const formatted = value?.format("YYYY-MM-DD");

        if (id === "from" && searchDate.to && value?.isAfter(searchDate.to)) {
            dispatch(
                notificationAction.setError({
                    message: '"From" date cannot be after "To" date',
                }),
            );
            return;
        }

        if (
            id === "to" &&
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

        setSearchDate((prev) => ({ ...prev, [id]: formatted }));
    };

    return {
        sortType,
        searchDate,
        handleSelectType,
        handleChangeDate,
    };
}
