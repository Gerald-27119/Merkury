import SpotTile from "./components/SpotTile.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSpots } from "../../http/spots-data.js";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import Home from "./Home.jsx";
import Carousel from "./components/SpotCarousel.jsx";

export default function FirstHomePage() {
  const { data } = useQuery({
    queryFn: () => fetchFilteredSpots("", 0, 5),
    queryKey: ["spots", "filter", "name", 0, 5],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const [isAdvance, setIsAdvance] = useState(false);
  const [city, setCity] = useState("");

  const handleToAdvanceSearch = () => {
    setIsAdvance(true);
  };

  const handleToSimpleSearch = () => {
    setIsAdvance(false);
  };

  const handleSearchCity = (event) => {
    setCity(event.target.value);
  };

  return (
    <>
      {!isAdvance && (
        <div
          className={`w-full min-h-screen text-darkText bg-darkBg flex flex-col items-center space-y-4 p-3 `}
        >
          <div className="flex my-5">
            <button
              onClick={handleToSimpleSearch}
              className={`${!isAdvance && "bg-gray-700 "} px-2 py-1.5 rounded-l-xl`}
            >
              Simple filters
            </button>
            <button
              onClick={handleToAdvanceSearch}
              className={`${isAdvance && "bg-gray-700 "} px-2 py-1.5 rounded-r-xl`}
            >
              Advanced filters
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
                onChange={handleSearchCity}
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
            <h1 className="text-3xl font-semibold capitalize">
              the most popular spots
            </h1>
            {data && <Carousel spots={data} />}
          </div>
          <div
            className={`flex flex-col items-center ${city === "" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"} space-y-4 transition-all duration-1000 ease-out`}
          >
            {city !== "" &&
              data?.map((spot) => <SpotTile key={spot.id} id={spot.id} />)}
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
