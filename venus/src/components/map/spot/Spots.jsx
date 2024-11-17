import Zone from "../zone/Zone.jsx";
import { SpotsData } from "../data/spots-data.js";
import SpotDetails from "./SpotDetails.jsx";

export default function Spots() {
  return (
    <>
      {SpotsData.map((spot) => (
        <Zone
          key={spot.id}
          zone={spot}
          color={"green"}
          DetailsComponent={SpotDetails}
        />
      ))}
    </>
  );
}
