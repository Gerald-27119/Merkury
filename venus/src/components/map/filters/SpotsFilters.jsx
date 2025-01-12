import { LiaSearchSolid } from "react-icons/lia";
import Input from "../../Input.jsx";
import Button from "../../../pages/account/Button.jsx";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { spotFiltersAction } from "../../../redux/spot-filters.jsx";
import { useEffect, useState } from "react";
import { fetchSpotsNames } from "../../../http/spotsData.js";

export default function SpotsFilters() {
  const [filters, setFilters] = useState({
    name: "",
    minRating: 0,
    maxRating: 5,
  });
  const [showHints, setShowHints] = useState(false);
  const [filteredNames, setFilteredNames] = useState([]);

  const { data: spotsNames = [] } = useQuery({
    queryKey: ["spotsNames", filters.name],
    queryFn: () => fetchSpotsNames(filters.name),
  });

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (filters.name) {
      setFilteredNames(spotsNames);
      setShowHints(true);
    } else {
      setShowHints(false);
    }
  }, [filters.name, spotsNames]);

  const handleNameChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: e.target.value,
    }));
    queryClient.invalidateQueries(["spotsNames", filters.name]);
  };

  const handleMinRatingChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      minRating: parseFloat(e.target.value),
    }));
  };

  const handlerMaxRatingChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      maxRating: parseFloat(e.target.value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(spotFiltersAction.setFilters(filters));
    queryClient.invalidateQueries([
      "spots",
      "filter",
      filters.name,
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end justify-center text-base mt-5 space-x-3"
    >
      <div className="flex items-center relative">
        <LiaSearchSolid size={30} className="mr-2 mt-1 text-white" />
        <Input
          id="name"
          type="text"
          placeholder="Search..."
          onBlur={() => setShowHints(false)}
          value={filters.name}
          onChange={handleNameChange}
        />
        {showHints && filteredNames.length > 0 && (
          <ul className="absolute text-base bg-white border border-neutral-950 mt-2 w-full z-50 left-0 top-full shadow-lg">
            {filteredNames.map((name) => (
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
          <Input
            id="minRate"
            label="From"
            type="number"
            min={0}
            max={5}
            step={0.5}
            value={filters.minRating.toFixed(1)}
            onChange={handleMinRatingChange}
          />
          <Input
            id="maxRate"
            label="To"
            type="number"
            min={0}
            max={5}
            step={0.5}
            value={filters.maxRating.toFixed(1)}
            onChange={handlerMaxRatingChange}
          />
        </div>
      </div>
      <Button
        type="submit"
        classNames="text-white bg-teal-400 hover:bg-emerald-400 p-2 rounded-md"
      >
        Apply filters
      </Button>
    </form>
  );
}
