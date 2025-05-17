import { LiaSearchSolid } from "react-icons/lia";
import FormInput from "../../../../components/form/FormInput.tsx";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { spotFiltersAction } from "../../../../redux/spot-filters.jsx";
import { useEffect, useState } from "react";
import { fetchSpotsNames } from "../../../../http/spots-data.js";
import useDebounce from "../../../../hooks/useDebounce.jsx";
import { Rate } from "antd";

export default function SpotsFilters() {
  const [filters, setFilters] = useState({
    name: "",
    minRating: 0,
    maxRating: 5,
  });
  const debounceSpotNamesHints = useDebounce(filters.name, 500);
  const [showHints, setShowHints] = useState(false);

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

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 flex items-end justify-center space-x-3 text-base"
    >
      <div className="relative flex items-center">
        <LiaSearchSolid size={30} className="mt-1 mr-2 text-white" />
        <FormInput
          id="name"
          type="text"
          placeholder="Search..."
          onBlur={() => setShowHints(false)}
          value={filters.name}
          onChange={handleNameChange}
        />
        {showHints && spotsNames.length > 0 && (
          <ul className="absolute top-full left-0 z-50 mt-2 w-full border border-neutral-950 bg-white text-base shadow-lg">
            {spotsNames.map((name) => (
              <li
                key={name}
                className="cursor-pointer p-2 hover:bg-gray-200"
                onMouseDown={() => handleHintClick(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col items-center">
        <p className="text-lg text-white">Rating:</p>
        <div className="flex space-x-3">
          <label className="text-white">FROM</label>
          <Rate
            allowHalf
            value={filters.minRating}
            onChange={handleMinRatingChange}
            className="rounded-md bg-white p-0.5"
          />
          <label className="text-white">TO</label>
          <Rate
            allowHalf
            value={filters.maxRating}
            onChange={handleMaxRatingChange}
            className="rounded-md bg-white p-0.5"
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-md bg-teal-400 p-2 text-white hover:bg-emerald-400"
      >
        Apply filters
      </button>
    </form>
  );
}
