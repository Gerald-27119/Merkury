import Spot from "./Spot.jsx";
import { SPOTS } from "../spots-data.js";

export default function SpotsList() {
  //TODO:potem będzie osobny endpoint z filtrami

  return (
    <div className="w-full bg-gray-900">
      <ul className="flex flex-col justify-center items-center text-white">
        {SPOTS.map((spot) => (
          <li key={spot.id} className="w-fit">
            <Spot spot={spot} />
          </li>
        ))}
      </ul>
    </div>
  );
}
