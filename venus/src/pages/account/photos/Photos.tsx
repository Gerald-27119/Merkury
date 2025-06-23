import { useQuery } from "@tanstack/react-query";
import { getAllUserPhotos } from "../../../http/user-dashboard";
import { FaEye, FaHeart } from "react-icons/fa";

export default function Photos() {
  const { data } = useQuery({
    queryKey: ["photos"],
    queryFn: getAllUserPhotos,
  });

  console.log(data);

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText flex min-h-full w-full flex-col p-17">
      <h1 className="text-4xl font-semibold capitalize lg:ml-27">Photos</h1>
      <div className="grid grid-cols-5 gap-3 lg:m-27">
        {data?.map(({ date, photos }) => (
          <div className="flex flex-col" key={date}>
            <p className="text-center text-4xl">{date}</p>
            {photos.map((image) => (
              <div className="group relative" key={image.id}>
                <img
                  className="aspect-square h-64 rounded-md object-cover drop-shadow-md"
                  src={image.src}
                  alt={image.src}
                />
                <div className="group-hover:bg-lightBg/70 dark:group-hover:bg-darkBg/60 absolute bottom-0 left-0 flex w-full justify-center gap-4 rounded-b-md py-2 text-xl transition duration-300">
                  <span className="flex items-center gap-2">
                    <FaHeart />
                    {image.heartsCount}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaEye />
                    {image.viewsCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
