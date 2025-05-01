import MapPage from "../map/MapPage.tsx";
import SpotDetails from "../spot/SpotDetails.jsx";
import { useSelector } from "react-redux";

export default function WelcomePage() {
  const showDetailsModal = useSelector((state) => state.spotDetails.showModal);
  return (
    <div className="relative h-full w-full">
      <div className="relative z-10">
        <h1 className="h-screen">Welcome Page</h1>
        {/*{showDetailsModal && <SpotDetails />}*/}
        {/*<MapPage />*/}
      </div>
    </div>
  );
}
