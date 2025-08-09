import { useQuery } from "@tanstack/react-query";
import { getSortedUserPhotos } from "../../../http/user-dashboard";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import { useDateSortFilter } from "../../../hooks/useDateSortFilter";
import { useEffect } from "react";
import { notificationAction } from "../../../redux/notification";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import Media from "../components/Media";

export default function Photos() {
    const dispatch = useDispatchTyped();
    const { sortType, searchDate, handleSelectType, handleChangeDate } =
        useDateSortFilter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["photos", sortType, searchDate.from, searchDate.to],
        queryFn: () =>
            getSortedUserPhotos(searchDate.from, searchDate.to, sortType),
    });

    useEffect(() => {
        if (isError) {
            dispatch(
                notificationAction.setError({
                    message:
                        "An error occurred while trying to load your photos",
                }),
            );
        }
    }, [isError]);

    return (
        <Media
            variant={AccountWrapperType.PHOTOS}
            searchDate={searchDate}
            onSortChange={handleSelectType}
            onDateChange={handleChangeDate}
            isLoading={isLoading}
            mediaList={data}
        />
    );
}
