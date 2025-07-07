import { useQuery } from "@tanstack/react-query";
import { getAllUserComments } from "../../../http/user-dashboard";
import AccountTitle from "../components/AccountTitle";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import DateBadge from "../components/DateBadge";
import CommentsList from "./components/CommentsList";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import SortAndDateFilters from "../components/SortAndDateFilters";
import { useDateSortFilter } from "../../../hooks/useDateSortFilter";
import { useEffect } from "react";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../redux/notification";

export default function Comments() {
    const dispatch = useDispatchTyped();
    const { sortType, searchDate, handleSelectType, handleChangeDate } =
        useDateSortFilter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["comments", sortType, searchDate.from, searchDate.to],
        queryFn: () =>
            getAllUserComments({
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
                        "An error occurred while trying to load your comments",
                }),
            );
        }
    }, [isError]);

    return (
        <AccountWrapper variant={AccountWrapperType.COMMENTS}>
            <div className="flex flex-wrap items-center justify-between space-y-2 space-x-3">
                <AccountTitle text="Comments" />
                <SortAndDateFilters
                    onSortChange={handleSelectType}
                    onDateChange={handleChangeDate}
                    from={searchDate.from}
                    to={searchDate.to}
                />
            </div>
            {isLoading && <LoadingSpinner />}
            <ul className="space-y-5 md:mx-27">
                {data?.length
                    ? data?.map((d) => (
                          <li
                              key={`${d.spotName}-${d.date}`}
                              className="flex flex-col space-y-5"
                          >
                              <DateBadge date={d.date}>
                                  <span className="flex flex-wrap">
                                      Comments to
                                      <p className="text-violetLight mx-2 font-semibold">
                                          {d.spotName}
                                      </p>
                                      spot
                                  </span>
                              </DateBadge>
                              <CommentsList comments={d.comments} />
                          </li>
                      ))
                    : null}
                {!data?.length && !isLoading ? (
                    <p className="text-center text-lg">
                        You haven't added any comments.
                    </p>
                ) : null}
            </ul>
        </AccountWrapper>
    );
}
