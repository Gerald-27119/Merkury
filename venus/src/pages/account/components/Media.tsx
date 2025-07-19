import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import AccountTitle from "./AccountTitle";
import SortAndDateFilters from "./SortAndDateFilters";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import DateBadge from "./DateBadge";
import AccountWrapper from "./AccountWrapper";
import DatedMediaGroup from "../../../model/interface/account/media/datedMediaGroup";
import { DateSortType } from "../../../model/enum/account/photos/dateSortType";
import { Dayjs } from "dayjs";
import Photo from "../photos/components/Photo";
import Movie from "../movies/components/Movie";

interface MediaProps {
    variant: AccountWrapperType;
    searchDate: { from: string | null; to: string | null };
    onSortChange: (type: DateSortType) => void;
    onDateChange: (value: Dayjs | null, key: "from" | "to") => void;
    isLoading: boolean;
    mediaList: DatedMediaGroup[] | undefined;
}

export default function Media({
    variant,
    mediaList,
    isLoading,
    onDateChange,
    searchDate,
    onSortChange,
}: MediaProps) {
    return (
        <AccountWrapper variant={variant}>
            <div className="flex flex-wrap items-center justify-between space-y-2 space-x-3">
                <AccountTitle
                    text={
                        variant === AccountWrapperType.PHOTOS
                            ? "Photos"
                            : "Movies"
                    }
                />
                <SortAndDateFilters
                    onSortChange={onSortChange}
                    onDateChange={onDateChange}
                    from={searchDate.from}
                    to={searchDate.to}
                />
            </div>
            <div className="flex flex-col gap-3 lg:mx-27">
                {isLoading && <LoadingSpinner />}
                {mediaList?.length
                    ? mediaList?.map(({ date, media }) => (
                          <div className="flex flex-col space-y-3" key={date}>
                              <DateBadge date={date} />
                              <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                  {media?.map((m) => {
                                      return variant ===
                                          AccountWrapperType.PHOTOS ? (
                                          <Photo photo={m} key={m.id} />
                                      ) : (
                                          <Movie movie={m} key={m.id} />
                                      );
                                  })}
                              </ul>
                          </div>
                      ))
                    : null}
                {!mediaList?.length && !isLoading ? (
                    <p className="text-center text-lg">
                        You haven't added any{" "}
                        {variant === AccountWrapperType.PHOTOS
                            ? "photos"
                            : "movies"}
                        .
                    </p>
                ) : null}
            </div>
        </AccountWrapper>
    );
}
