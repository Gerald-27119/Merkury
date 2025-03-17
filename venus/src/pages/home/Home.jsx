import TagCheckbox from "./components/TagCheckbox.jsx";
import Range from "./components/Range.jsx";
import Stars from "./components/Stars.jsx";
import Select from "./components/Select.jsx";
import SearchBar from "./components/SearchBar.jsx";
import SpotTile from "./components/SpotTile.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSpots } from "../../http/spots-data.js";

export default function Home() {
  const { data } = useQuery({
    queryFn: () => fetchFilteredSpots("", 0, 5),
    queryKey: ["spots", "filter", "name", 0, 5],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="min-h-screen w-full flex text-darkText">
      <div className="w-1/4 bg-darkBgSoft flex flex-col items-center space-y-4">
        <h1 className="text-3xl uppercase font-semibold text-center mt-3">
          Filters
        </h1>
        <Select />
        <SearchBar />
        <div className="flex flex-col w-3/4 items-center space-y-1">
          <h1 className="font-semibold text-lg">Rating</h1>
          <div className="flex justify-around bg-darkBgMuted pb-2 pt-1 rounded-md w-full">
            <Stars value={0} text="from" />
            <Stars value={4} text="to" />
          </div>
        </div>
        <div className="flex flex-col w-3/4">
          <TagCheckbox number={1} />
          <TagCheckbox number={2} />
          <TagCheckbox number={3} />
        </div>
        <Range />
      </div>
      <div className="w-3/4 bg-darkBg flex flex-col items-center space-y-4 p-3 ">
        <h1 className="text-6xl font-semibold uppercase">All spots</h1>
        <div className="flex flex-col items-center space-y-4">
          {data?.map((spot) => (
            <SpotTile key={spot.id} id={spot.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
