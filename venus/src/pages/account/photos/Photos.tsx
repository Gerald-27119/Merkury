import { useMutation } from "@tanstack/react-query";
import { getSortedUserPhotos } from "../../../http/user-dashboard";
import DateBadge from "./components/DateBadge";
import Photo from "./components/Photo";
import DateChooser from "./components/DateChooser";
import { PhotosSortType } from "../../../model/enum/account/photos/photosSortType";
import { useEffect, useState } from "react";
import PhotosWithDate from "../../../model/interface/account/photos/photosWithDate";
import { Dayjs } from "dayjs";
import SortDropdown from "./components/SortDropdown";

export default function Photos() {
  const [optionType, setOptionType] = useState(PhotosSortType.DATE_INCREASE);
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [data, setData] = useState<PhotosWithDate[]>([]);

  const { mutateAsync } = useMutation({
    mutationKey: ["photos", optionType, from, to],
    mutationFn: getSortedUserPhotos,
  });

  useEffect(() => {
    const test = async () => {
      const result = await mutateAsync({ type: optionType, from, to });
      setData(result);
    };

    test();
  }, [from, to, optionType]);

  const handleSelectType = (type: PhotosSortType) => {
    setOptionType(type);
  };

  const handleChangeFrom = (value: Dayjs) => {
    setFrom(value.format("YYYY-MM-DD"));
  };

  const handleChangeTo = (value: Dayjs) => {
    setTo(value.format("YYYY-MM-DD"));
  };

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText flex min-h-full w-full flex-col space-y-8 p-10 pt-17 xl:pt-10">
      <div className="flex items-center justify-between lg:mx-27">
        <h1 className="text-4xl font-semibold capitalize">Photos</h1>
        <div className="text-darkText flex space-x-3">
          <SortDropdown onSelectType={handleSelectType} />
          <div className="bg-violetDark flex items-center space-x-3 rounded-full px-2 py-1">
            <DateChooser type={"from"} onChange={handleChangeFrom} />
            <DateChooser type={"to"} onChange={handleChangeTo} />
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
