import { RiArrowDownSLine } from "react-icons/ri";

export default function SearchedSpotsSortingForm() {
  return (
    <form className="bg-violetLight mb-5 w-80 rounded-2xl px-5 py-1 text-base font-semibold">
      <div className="flex items-center">
        <label htmlFor="searched-spots-sorting">Sort:</label>
        <select
          name="searched-spots-sorting"
          id="searched-spots-sorting"
          className="ml-auto flex cursor-pointer appearance-none items-center justify-between text-right text-base"
        >
          <option value="none" selected>
            Default
          </option>
          <option value="byRatingAsc">Rating ascending</option>
          <option value="byRatingDesc">Rating descending</option>
          <option value="byRatingCountAsc">Rating count ascending</option>
          <option value="byRatingCountDesc">Rating count descending</option>
        </select>
        <RiArrowDownSLine className="cursor-pointer text-center text-xl" />
      </div>
    </form>
  );
}
