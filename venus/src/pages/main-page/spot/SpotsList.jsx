import Spot from "./Spot.jsx";
import {SPOTS} from "../spots-data.js";

export default function SpotsList() {
    //TODO:potem będzie osobny endpoint z filtrami

    return (
        <ul>
            {SPOTS.map(spot => (
                <li key={spot.id}><Spot spot={spot} /> </li>
            ))}
        </ul>
    );
}