import { useQuery } from "@tanstack/react-query";
import { getSortedUserPhotos } from "../../../http/user-dashboard";
import DateBadge from "./components/DateBadge";
import Photo from "./components/Photo";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import DateChooser from "./components/DateChooser";
import { PhotosSortType } from "../../../model/enum/account/photos/photosSortType";
import { ChangeEvent, useState } from "react";

const sortOptions = [
  { value: PhotosSortType.DATE_INCREASE, name: "Date increase" },
  { value: PhotosSortType.DATE_DECREASE, name: "Date decrease" },
  { value: PhotosSortType.VIEWS_INCREASE, name: "Views increase" },
  { value: PhotosSortType.VIEWS_DECREASE, name: "Views decrease" },
  { value: PhotosSortType.HEARTS_INCREASE, name: "Hearts increase" },
  { value: PhotosSortType.HEARTS_DECREASE, name: "Hearts decrease" },
];

export default function Photos() {
  const [optionType, setOptionType] = useState(PhotosSortType.DATE_INCREASE);

  const { data, isLoading } = useQuery({
    queryKey: ["photos", optionType],
    queryFn: () => getSortedUserPhotos(optionType),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSelectType = (event: ChangeEvent<HTMLSelectElement>) => {
    setOptionType(event.target.value);
  };

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText flex min-h-full w-full flex-col space-y-8 p-10 pt-17 xl:pt-10">
      <div className="flex items-center justify-between lg:mx-27">
        <h1 className="text-4xl font-semibold capitalize">Photos</h1>
        <div className="flex space-x-3">
          <div className="bg-violetDark flex space-x-2 rounded-full px-2 py-1">
            <p>Sort:</p>
            <select onChange={handleSelectType}>
              {sortOptions.map((o) => (
                <option value={o.value} key={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-violetDark flex items-center space-x-3 rounded-full px-2 py-1">
            <DateChooser type={"from"} data={data} />
            <DateChooser type={"to"} data={data} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:mx-27">
        {data?.map(({ date, photos }) => (
          <div className="flex flex-col space-y-3" key={date}>
            <DateBadge date={date} />
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {photos.map((photo) => (
                <Photo photo={photo} key={photo.id} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
