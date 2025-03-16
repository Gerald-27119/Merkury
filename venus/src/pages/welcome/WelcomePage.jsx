import Map from "../map/Map.jsx";
import SpotDetails from "../spot/SpotDetails.jsx";
import { useSelector } from "react-redux";
import SpotsFilters from "../map/components/spot-filters/SpotsFilters.jsx";

export default function WelcomePage() {
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="relative z-10">
        <SpotsFilters />
        <SpotDetails />
        {showDetailsModal && <SpotDetails />}
        <Map />
      </div>
    </div>
  );
}
