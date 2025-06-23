import { useQuery } from "@tanstack/react-query";
import { getAllUserPhotos } from "../../../http/user-dashboard";
import DateBadge from "./components/DateBadge";
import Photo from "./components/Photo";

export default function Photos() {
  const { data } = useQuery({
    queryKey: ["photos"],
    queryFn: getAllUserPhotos,
  });

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText flex min-h-full w-full flex-col space-y-8 p-10 pt-17 xl:pt-10">
      <h1 className="text-4xl font-semibold capitalize lg:ml-27">Photos</h1>
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
