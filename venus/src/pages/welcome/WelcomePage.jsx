import Map from "../map/Map.jsx";
import SpotDetails from "../spot/SpotDetails.jsx";
import { useSelector } from "react-redux";

export default function WelcomePage() {
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);
  return (
    <div className="relative w-full h-full">
      <div className="relative z-10">
        {showDetailsModal && <SpotDetails />}
        <Map />
      </div>
    </div>
  );
}
