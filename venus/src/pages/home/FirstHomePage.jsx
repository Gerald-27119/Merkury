import SpotTile from "./components/SpotTile.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSpots } from "../../http/spots-data.js";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import Home from "./Home.jsx";

export default function FirstHomePage() {
  const { data } = useQuery({
    queryFn: () => fetchFilteredSpots("", 0, 5),
    queryKey: ["spots", "filter", "name", 0, 5],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const [isAdvance, setIsAdvance] = useState(false);

  const handleToAdvanceSearch = () => {
    setIsAdvance(true);
  };

  const handleToSimpleSearch = () => {
    setIsAdvance(false);
  };

  return (
    <>
      {!isAdvance && (
        <div className="w-full text-darkText bg-darkBg flex flex-col items-center space-y-4 p-3 ">
          <div className="space-x-3">
            <button
              className={`rounded-full bg-darkBgSoft py-2 px-3 ${!isAdvance && "border border-darkBorder"}`}
              onClick={handleToSimpleSearch}
            >
              Simple search
            </button>
            <button
              onClick={handleToAdvanceSearch}
              className={`rounded-full bg-darkBgSoft py-2 px-3 ${isAdvance && "border border-darkBorder"}`}
            >
              Advance search
            </button>
          </div>
          <div className="w-1/2 flex justify-end bg-darkBgSoft rounded-lg p-2 items-center">
            <div className="flex flex-col w-full justify-start">
              <label htmlFor="search" className="ml-2">
                Location
              </label>
              <input
                className="w-full rounded-lg py-3 px-2 bg-darkBgSoft focus:ring-0 focus:outline-0"
                id="search"
                placeholder="Your city"
              />
            </div>
            <button
              className="px-4 h-fit py-3 rounded-md bg-darkBg"
              onClick={handleToAdvanceSearch}
            >
              <FaSearch />
            </button>
          </div>
          <div className="flex flex-col items-center space-y-4">
            {data?.map((spot) => (
              <SpotTile key={spot.id} id={spot.id} />
            ))}
          </div>
        </div>
      )}
      {isAdvance && (
        <Home
          isAdvance={isAdvance}
          handleToAdvanceSearch={handleToAdvanceSearch}
          handleToSimpleSearch={handleToSimpleSearch}
        />
      )}
    </>
  );
}
