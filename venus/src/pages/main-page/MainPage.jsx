import SpotsList from "./spot/SpotsList.jsx";
import { FaCity } from "react-icons/fa";
import Input from "../../components/form/Input.jsx";
import { useEffect, useState } from "react";
import SpotCarousel from "./spot/SpotCarousel.jsx";

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

export default function MainPage() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCityHints, setShowCityHints] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
  });

  const handleClickShowAdvancedFilters = () => {
    setShowAdvancedFilters(true);
  };

  const handleClickHideAdvancedFilters = () => {
    setShowAdvancedFilters(false);
  };

  useEffect(() => {
    if (filters.city) {
      setShowCityHints(true);
    } else {
      setShowCityHints(false);
    }
  }, [filters.city]);

  const handleCityChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      city: e.target.value,
    }));
  };

  const handleCityHintClick = (city) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      city: city,
    }));
    setShowCityHints(false);
  };

  return (
    <div className="bg-gray-900 w-full h-screen flex flex-col items-center">
      <div className="flex text-white my-5">
        <button
          onClick={handleClickHideAdvancedFilters}
          className={`${showAdvancedFilters ? "" : "bg-slate-700 "}px-2 py-1.5 rounded-l-xl transform transition duration-500`}
        >
          Simple filters
        </button>
        <button
          onClick={handleClickShowAdvancedFilters}
          className={`${showAdvancedFilters ? "bg-gray-700 " : ""}px-2 py-1.5 rounded-r-xl transform transition duration-500`}
        >
          Advanced filters
        </button>
      </div>
      {!showAdvancedFilters && (
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
      )}
      {!showAdvancedFilters && <SpotCarousel />}
      {showAdvancedFilters && <SpotsList />}
    </div>
  );
}
