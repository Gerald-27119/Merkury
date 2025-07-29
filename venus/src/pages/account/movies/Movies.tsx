import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { useDateSortFilter } from "../../../hooks/useDateSortFilter";
import { useQuery } from "@tanstack/react-query";
import { getSortedUserMovies } from "../../../http/user-dashboard";
import { useEffect } from "react";
import { notificationAction } from "../../../redux/notification";
import Media from "../components/Media";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";

export default function Movies() {
    const dispatch = useDispatchTyped();
    const { sortType, searchDate, handleSelectType, handleChangeDate } =
        useDateSortFilter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["movies", sortType, searchDate.from, searchDate.to],
        queryFn: () =>
            getSortedUserMovies({
                from: searchDate.from,
                to: searchDate.to,
                type: sortType,
            }),
    });

    useEffect(() => {
        if (isError) {
            dispatch(
                notificationAction.setError({
                    message:
                        "An error occurred while trying to load your movies",
                }),
            );
        }
    }, [isError]);

    return (
        <Media
            variant={AccountWrapperType.MOVIES}
            searchDate={searchDate}
            onSortChange={handleSelectType}
            onDateChange={handleChangeDate}
            isLoading={isLoading}
            mediaList={data}
        />
    );
}
