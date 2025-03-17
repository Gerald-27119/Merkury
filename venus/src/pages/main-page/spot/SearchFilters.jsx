import { useEffect, useState } from "react";
import { spotFiltersAction } from "../../../redux/spot-filters.jsx";
import Input from "../../../components/form/Input.jsx";
import { FaCity } from "react-icons/fa";
import { LiaSearchSolid } from "react-icons/lia";
import { Rate } from "antd";

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

export const SPOTS_NAMES = [
  "Pomnik konny Jana III Sobieskiego",
  "Skwer Czesława Niemena",
  "Park Wałowy",
  "Park",
  "Jar Wilanowski",
  "Plac imienia Dariusza Kobzdeja",
  "Plac Zabaw na Wroniej Górce",
  "Plaża stogi",
  "Park Oruński im. Emilii Hoene",
  "Park Street Workout",
];

const CATEGORIES = ["city", "photos", "park", "beach", "FPV"];

export default function SearchFilters() {
  const [showHints, setShowHints] = useState(false);
  const [showCityHints, setShowCityHints] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    minRating: 0,
    maxRating: 5,
    city: "",
    categories: [],
  });

  useEffect(() => {
    if (filters.name) {
      setShowHints(true);
    } else {
      setShowHints(false);
    }
  }, [filters.name]);

  useEffect(() => {
    if (filters.city) {
      setShowCityHints(true);
    } else {
      setShowCityHints(false);
    }
  }, [filters.city]);

  const handleCategoryChange = (category) => {
    setFilters((prevFilters) => {
      const categories = prevFilters.categories.includes(category)
        ? prevFilters.categories.filter((cat) => cat !== category)
        : [...prevFilters.categories, category];
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
      className="flex flex-col items-center text-base mt-5"
    >
      <div className="flex flex-col items-center space-y-4 relative">
        <div className="relative">
          <div className="flex">
            <FaCity size={30} className="mr-2 mt-1 text-white" />
            <Input
              id="name"
              type="text"
              placeholder="Search by city..."
              onBlur={() => setShowCityHints(false)}
              value={filters.city}
              onChange={handleCityChange}
            />
          </div>
          {showCityHints && (
            <ul className="absolute text-base bg-white border border-neutral-950 w-full z-50 shadow-lg">
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
        </div>
        <div className="relative">
          <div className="flex">
            <LiaSearchSolid size={30} className="mr-2 mt-1 text-white" />
            <Input
              id="name"
              type="text"
              placeholder="Search by name..."
              onBlur={() => setShowHints(false)}
              value={filters.name}
              onChange={handleNameChange}
            />
          </div>
          {showHints && SPOTS_NAMES.length > 0 && (
            <ul className="absolute text-base bg-white border border-neutral-950 mt-2 w-full z-50 shadow-lg">
              {SPOTS_NAMES.map((name) => (
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
      </div>
      <div className="flex flex-col items-center mt-3">
        <p className="text-white text-lg mt-2">Rating:</p>
        <div className="flex flex-col space-y-3 items-end">
          <div className="flex space-x-3 items-center">
            <label className="text-white">FROM</label>
            <div className="custom-rate mt-1">
              <Rate
                allowHalf
                value={filters.minRating}
                onChange={handleMinRatingChange}
              />
            </div>
          </div>
          <div className="flex space-x-3 items-center">
            <label className="text-white">TO</label>
            <div className="custom-rate mt-1">
              <Rate
                allowHalf
                value={filters.maxRating}
                onChange={handleMaxRatingChange}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <p className="text-white text-lg w-28">Tags:</p>
          <div className="flex flex-col items-end text-lg text-white ">
            {CATEGORIES.map((category) => (
              <button
                onClick={() => handleCategoryChange(category)}
                className={
                  filters.categories.includes(category)
                    ? "border-2 border-emerald-600 w-28 my-1.5 rounded-md text-emerald-600 font-semibold"
                    : "border-2 border-white w-28 my-1.5 rounded-md"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="text-white text-center text-lg hover:font-semibold bg-emerald-600 hover:bg-emerald-700 p-2 rounded-md mt-4 w-36"
      >
        Apply filters
      </button>
    </form>
  );
}
