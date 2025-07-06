import { useQuery } from "@tanstack/react-query";
import { getSortedUserPhotos } from "../../../http/user-dashboard";
import DateBadge from "../components/DateBadge";
import Photo from "./components/Photo";
import AccountTitle from "../components/AccountTitle";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import { useDateSortFilter } from "../../../hooks/useDateSortFilter";
import SortAndDateFilters from "../components/SortAndDateFilters";
import { useEffect } from "react";
import { notificationAction } from "../../../redux/notification";
import useDispatchTyped from "../../../hooks/useDispatchTyped";

export default function Photos() {
    const dispatch = useDispatchTyped();
    const { sortType, searchDate, handleSelectType, handleChangeDate } =
        useDateSortFilter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["photos", sortType, searchDate.from, searchDate.to],
        queryFn: () =>
            getSortedUserPhotos({
                from: searchDate.from,
                to: searchDate.to,
                type: sortType,
            }),
    });

    useEffect(() => {
        dispatch(
            notificationAction.setError({
                message: "An error occurred while trying to load your photos",
            }),
        );
    }, [isError]);

    return (
        <AccountWrapper variant={AccountWrapperType.PHOTOS}>
            <div className="flex flex-wrap items-center justify-between space-y-2 space-x-3">
                <AccountTitle text="Photos" />
                <SortAndDateFilters
                    onSortChange={handleSelectType}
                    onDateChange={handleChangeDate}
                    from={searchDate.from}
                    to={searchDate.to}
                />
            </div>
            <div className="flex flex-col gap-3 lg:mx-27">
                {isLoading && <LoadingSpinner />}
                {data?.length
                    ? data?.map(({ date, photos }) => (
                          <div className="flex flex-col space-y-3" key={date}>
                              <DateBadge date={date} />
                              <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                  {photos.map((photo) => (
                                      <Photo photo={photo} key={photo.id} />
                                  ))}
                              </ul>
                          </div>
                      ))
                    : null}
                {!data?.length && !isLoading ? (
                    <p className="text-center text-lg">
                        You haven't added any photos.
                    </p>
                ) : null}
            </div>
        </AccountWrapper>
    );
}
