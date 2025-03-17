import Spot from "./Spot.jsx";
import { SPOTS } from "../spots-data.js";
import SearchFilters from "./SearchFilters.jsx";

export default function SpotsList() {
  //TODO:potem będzie osobny endpoint z filtrami

  return (
    <div className="w-full bg-gray-900 grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <SearchFilters />
      </div>
      <div className="col-span-2 col-start-2 col-end-4">
        <ul className="flex flex-col justify-center items-center text-white">
          {SPOTS.map((spot) => (
            <li key={spot.id} className="w-fit">
              <Spot spot={spot} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
