import { LiaSearchSolid } from "react-icons/lia";
import Input from "../../Input.jsx";
import Button from "../../../pages/account/Button.jsx";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { spotFiltersAction } from "../../../redux/spot-filters.jsx";
import { useState } from "react";

export default function SpotsFilters() {
  const [name, setName] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleMinRatingChange = (e) => {
    setMinRating(parseFloat(e.target.value));
  };

  const handlerMaxRatingChange = (e) => {
    setMaxRating(parseFloat(e.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(spotFiltersAction.setFilters({ name, minRating, maxRating }));
    queryClient.invalidateQueries([
      "spots",
      "filter",
      name,
      minRating,
      maxRating,
    ]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end justify-center text-base mt-5 space-x-3"
    >
      <div className="flex items-center">
        <LiaSearchSolid size={30} className="mr-2 mt-1 text-white" />
        <Input
          id="name"
          type="text"
          placeholder="Search..."
          // onBlur={() => setShowHints(false)}
          value={name}
          onChange={handleNameChange}
        />
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
            value={minRating.toFixed(1)}
            onChange={handleMinRatingChange}
          />
          <Input
            id="maxRate"
            label="To"
            type="number"
            min={0}
            max={5}
            step={0.5}
            value={maxRating.toFixed(1)}
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
