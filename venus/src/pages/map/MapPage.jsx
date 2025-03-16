import Map from "../map/Map.jsx";
import SpotDetails from "../spot/SpotDetails.jsx";
import { useSelector } from "react-redux";
import SpotsFilters from "./components/spot-filters/SpotsFilters.jsx";

export default function MapPage() {
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);

  return (
    <div className="relative w-full h-full">
      <div className="relative z-10">
        {/*  czemu tego nie widac? pasek wyszukwiania jak na google maps*/}
        {/*<SpotsFilters />*/}
        {showDetailsModal && <SpotDetails />}
        <Map />
      </div>
    </div>
  );
}
