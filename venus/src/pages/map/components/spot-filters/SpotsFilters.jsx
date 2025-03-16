import { LiaSearchSolid } from "react-icons/lia";
import Input from "../../../../components/form/Input.jsx";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { spotFiltersAction } from "../../../../redux/spot-filters.jsx";
import { useEffect, useState } from "react";
import { fetchSpotsNames } from "../../../../http/spots-data.js";
import useDebounce from "../../../../hooks/useDebounce.jsx";
import { Rate } from "antd";
import { useLocation } from "react-router-dom";
import { FaCity } from "react-icons/fa";

const CITY_NAMES = [
  "Wrocław",
  "Warszawa",
  "Poznań",
  "Kraków",
  "Łódź",
  "Lublin",
  "Katowice",
  "Białystok",
  "Gdańsk",
  "Szczecin",
  "Opole",
  "Rzeszów",
  "Kielce",
  "Olsztyn",
  "Bydgoszcz",
  "Toruń",
  "Gorzów Wielkopolski",
  "Zielona Góra",
];
const CATEGORIES = ["city", "photos", "park", "beach", "FPV"];

export default function SpotsFilters() {
  const { pathname } = useLocation();
  const [filters, setFilters] = useState({
    name: "",
    minRating: 0,
    maxRating: 5,
    city: "",
    categories: [],
  });
  const debounceSpotNamesHints = useDebounce(filters.name, 500);
  const [showHints, setShowHints] = useState(false);
  const [showCityHints, setShowCityHints] = useState(false);

  const { data: spotsNames = [] } = useQuery({
    queryKey: ["spotsNames", debounceSpotNamesHints],
    queryFn: () => fetchSpotsNames(debounceSpotNamesHints),
    enabled: debounceSpotNamesHints.trim().length > 0,
  });

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (debounceSpotNamesHints) {
      setShowHints(true);
    } else {
      setShowHints(false);
    }
  }, [debounceSpotNamesHints]);

  useEffect(() => {
    if (filters.city) {
      setShowCityHints(true);
    } else {
      setShowCityHints(false);
    }
  }, [filters.city]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prevFilters) => {
      const categories = checked
        ? [...prevFilters.categories, value]
        : prevFilters.categories.filter((category) => category !== value);
      return { ...prevFilters, categories };
    });
  };

  const handleCityChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      city: e.target.value,
    }));
  };

  const handleNameChange = async (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: e.target.value,
    }));
    await queryClient.invalidateQueries(["spotsNames", debounceSpotNamesHints]);
  };

  const handleMinRatingChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      minRating: parseFloat(value),
    }));
  };

  const handleMaxRatingChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      maxRating: parseFloat(value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(spotFiltersAction.setFilters(filters));
    queryClient.invalidateQueries([
      "spots",
      "filter",
      debounceSpotNamesHints,
      filters.minRating,
      filters.maxRating,
    ]);
  };

  const handleHintClick = (hint) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: hint,
    }));
    setShowHints(false);
  };

  const handleCityHintClick = (city) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      city: city,
    }));
    setShowCityHints(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end justify-center text-base mt-5 space-x-3"
    >
      <div className="flex items-center relative">
        {pathname === "/" && (
          <>
            <div className="flex flex-col items-center">
              <p className="text-white text-lg">Tags:</p>
              <div className="flex flex-wrap space-x-3 mr-10">
                {CATEGORIES.map((category) => (
                  <Input
                    type="checkbox"
                    value={category}
                    checked={filters.categories.includes(category)}
                    onChange={handleCategoryChange}
                    label={category}
                    labelClassNames="uppercase text-sm dark:text-darkText text-lightText block pb-1 px-2"
                  />
                ))}
              </div>
            </div>
            <FaCity size={30} className="mr-2 mt-1 text-white" />
            <Input
              id="name"
              type="text"
              placeholder="Search..."
              onBlur={() => setShowCityHints(false)}
              value={filters.city}
              onChange={handleCityChange}
            />
            {showCityHints && (
              <ul className="absolute text-base bg-white border border-neutral-950 mt-2 w-full z-50 left-0 top-full shadow-lg">
                {CITY_NAMES.filter((name) =>
                  name.toLowerCase().includes(filters.city.toLowerCase()),
                ).map((name) => (
                  <li
                    key={name}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onMouseDown={() => handleCityHintClick(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <LiaSearchSolid size={30} className="mr-2 mt-1 text-white" />
        <Input
          id="name"
          type="text"
          placeholder="Search..."
          onBlur={() => setShowHints(false)}
          value={filters.name}
          onChange={handleNameChange}
        />
        {showHints && spotsNames.length > 0 && (
          <ul className="absolute text-base bg-white border border-neutral-950 mt-2 w-full z-50 left-0 top-full shadow-lg">
            {spotsNames.map((name) => (
              <li
                key={name}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onMouseDown={() => handleHintClick(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col items-center">
        <p className="text-white text-lg">Rating:</p>
        <div className="flex space-x-3">
          <label className="text-white">FROM</label>
          <Rate
            allowHalf
            value={filters.minRating}
            onChange={handleMinRatingChange}
            className="bg-white rounded-md p-0.5 "
          />
          <label className="text-white">TO</label>
          <Rate
            allowHalf
            value={filters.maxRating}
            onChange={handleMaxRatingChange}
            className="bg-white rounded-md p-0.5"
          />
        </div>
      </div>
      <button
        type="submit"
        className="text-white bg-teal-400 hover:bg-emerald-400 p-2 rounded-md"
      >
        Apply filters
      </button>
    </form>
  );
}
