import { useQuery } from "@tanstack/react-query";
import { getSortedUserPhotos } from "../../../http/user-dashboard";
import DateBadge from "./components/DateBadge";
import Photo from "./components/Photo";
import DateChooser from "./components/DateChooser";
import { PhotosSortType } from "../../../model/enum/account/photos/photosSortType";
import { useState } from "react";
import { Dayjs } from "dayjs";
import SortDropdown from "./components/SortDropdown";
import AccountTitle from "../components/AccountTitle";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";

export default function Photos() {
  const [optionType, setOptionType] = useState(PhotosSortType.DATE_DECREASE);
  const [searchDate, setSearchDate] = useState({
    from: null,
    to: null,
  });

  const { data } = useQuery({
    queryKey: ["photos", optionType, searchDate.from, searchDate.to],
    queryFn: () =>
      getSortedUserPhotos({
        from: searchDate.from,
        to: searchDate.to,
        type: optionType,
      }),
  });

  const handleSelectType = (type: PhotosSortType) => {
    setOptionType(type);
  };

  const handleChangeDate = (value: Dayjs, id: string) => {
    setSearchDate((prevState) => ({
      ...prevState,
      [id]: value.format("YYYY-MM-DD"),
    }));
  };

  return (
    <AccountWrapper variant={AccountWrapperType.PHOTOS}>
      <div className="flex flex-wrap items-center justify-between space-y-2 space-x-3">
        <AccountTitle text="Photos" />
        <div className="text-darkText flex flex-wrap space-y-3 space-x-3 md:space-y-0 lg:mx-27">
          <SortDropdown onSelectType={handleSelectType} />
          <div className="bg-violetDark flex h-15 items-center space-x-3 rounded-full px-2.5 py-1 md:h-12">
            <DateChooser
              type={"from"}
              onChange={(value) => handleChangeDate(value, "from")}
            />
            <DateChooser
              type={"to"}
              onChange={(value) => handleChangeDate(value, "to")}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:mx-27">
        {data?.length ? (
          data?.map(({ date, photos }) => (
            <div className="flex flex-col space-y-3" key={date}>
              <DateBadge date={date} />
              <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {photos.map((photo) => (
                  <Photo photo={photo} key={photo.id} />
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-center text-lg">You haven't added any photos.</p>
        )}
      </div>
    </AccountWrapper>
  );
}
