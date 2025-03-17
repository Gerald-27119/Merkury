import Stars from "./Stars.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchSpotsDataById } from "../../../http/spots-data.js";
import { FaLocationDot } from "react-icons/fa6";

export default function SpotTile({ id }) {
  const { data } = useQuery({
    queryFn: () => fetchSpotsDataById(id),
    queryKey: ["spots", id],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="h-fit w-1/2 flex p-4 bg-darkBgSoft rounded-md rounded-l-lg gap-4">
      <img
        className="w-96 aspect-square rounded-full object-cover"
        src={data?.photos[0].img}
        alt={data?.name}
      />
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end space-x-3 items-center">
            <FaLocationDot className="text-red-600" size={23} />
            <span className="text-end text-lg">Gdańsk</span>
          </div>
          <div className="flex flex-col space-y-3">
            <Stars value={data?.rating} disabled />
            <h1 className="text-xl font-semibold">{data?.name}</h1>
            <div className="flex  gap-2">
              <span className="border border-darkBorder p-1 rounded-md">
                Tag 1
              </span>
              <span className="border border-darkBorder p-1 rounded-md">
                Tag 2
              </span>
              <span className="border border-darkBorder p-1 rounded-md">
                Tag 3
              </span>
            </div>
          </div>
        </div>
        <span className="text-base break-words">{data?.description}</span>
      </div>
    </div>
  );
}
