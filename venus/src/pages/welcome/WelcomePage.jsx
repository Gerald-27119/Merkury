import Map from "../../components/map/Map.jsx";
import SpotDetails from "../../components/map/spot/SpotDetails.jsx";
import { useSelector } from "react-redux";

export default function WelcomePage() {
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);
  return (
    <>
      {showDetailsModal && <SpotDetails />}
      <Map />
    </>
  );
}
