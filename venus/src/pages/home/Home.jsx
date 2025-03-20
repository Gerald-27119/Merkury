import TagCheckbox from "./components/TagCheckbox.jsx";
import Range from "./components/Range.jsx";
import Stars from "./components/Stars.jsx";
import Select from "./components/Select.jsx";
import SearchBar from "./components/SearchBar.jsx";
import SpotTile from "./components/SpotTile.jsx";
import { useQuery } from "@tanstack/react-query";
import {
  fetchFilteredSpots,
  fetchUserFavouriteSpots,
} from "../../http/spots-data.js";
import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function Home({
  isAdvance,
  handleToSimpleSearch,
  handleToAdvanceSearch,
}) {
  const { data } = useQuery({
    queryFn: () => fetchFilteredSpots("", 0, 5),
    queryKey: ["spots", "filter", "name", 0, 5],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: favorites } = useQuery({
    queryFn: () => fetchUserFavouriteSpots(0),
    queryKey: ["favouriteSpots", 0],
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
  });

  const isLogged = useSelector((state) => state.account.isLogged);

  return (
    <div className="min-h-screen w-full flex text-darkText">
      {/*<div className="w-1/4 bg-darkBgSoft flex flex-col items-center space-y-4 px-4">*/}
      {/*  <h1 className="text-3xl uppercase font-semibold text-center mt-3">*/}
      {/*    Filters*/}
      {/*  </h1>*/}
      {/*  <Select />*/}
      {/*  <SearchBar />*/}
      {/*  <div className="flex flex-col w-full items-center space-y-1">*/}
      {/*    <h1 className="font-semibold text-lg">Rating</h1>*/}
      {/*    <div className="flex justify-around bg-darkBgMuted pb-2 pt-1 rounded-md w-full">*/}
      {/*      <Stars value={0} text="from" />*/}
      {/*      <Stars value={4} text="to" />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="flex flex-col w-full">*/}
      {/*    <TagCheckbox number={1} />*/}
      {/*    <TagCheckbox number={2} />*/}
      {/*    <TagCheckbox number={3} />*/}
      {/*  </div>*/}
      {/*  <Range />*/}
      {/*</div>*/}
      <div className="w-full bg-darkBg flex flex-col items-center space-y-4 p-3 ">
        <div className="flex text-white my-5">
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
              // onChange={handleSearchCity}
            />
          </div>
          <button
            className="px-4 h-fit py-3 rounded-md bg-darkBg"
            onClick={handleToAdvanceSearch}
          >
            <FaSearch />
          </button>
        </div>
        <ul className="flex flex-col items-center space-y-4">
          {data?.map((spot) => (
            <SpotTile key={spot.id} id={spot.id} />
          ))}
        </ul>
      </div>
      {/*{isLogged && (*/}
      {/*  <div className="w-1/4 bg-darkBgSoft flex flex-col space-y-4">*/}
      {/*    <h1 className="text-3xl uppercase font-semibold text-center mt-3">*/}
      {/*      Favorites Spots*/}
      {/*    </h1>*/}
      {/*    <ul className="w-full p-4 flex flex-col space-y-3">*/}
      {/*      {favorites?.content?.map((spot) => (*/}
      {/*        <li*/}
      {/*          key={spot?.id}*/}
      {/*          className="h-fit w-full flex items-center p-4 shadow-lg shadow-darkBg bg-darkBgSoft rounded-md rounded-l-lg space-x-6"*/}
      {/*        >*/}
      {/*          <img*/}
      {/*            className="w-48 aspect-square rounded-full object-cover"*/}
      {/*            src={spot?.img.img}*/}
      {/*            alt={spot?.name}*/}
      {/*          />*/}
      {/*          <h1>{spot.name}</h1>*/}
      {/*        </li>*/}
      {/*      ))}*/}
      {/*    </ul>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
}
