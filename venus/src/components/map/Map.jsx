import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PjatkLocationMarker from "./PjatkMarker.jsx";
import UserLocationMarker from "./UserLocationMarker.jsx";
import Spots from "./spot/Spots.jsx";
import { useEffect } from "react";

/**
 * Komponent Map - wyświetla interaktywną mapę z różnymi znacznikami.
 *
 * @component
 * @returns {JSX.Element} Komponent mapy zawierający warstwę OpenStreetMap
 * oraz niestandardowe znaczniki lokalizacji.
 */
export default function Map() {
  const defaultPosition = [54.352553, 18.64745];

  function CustomZoomControl() {
    const map = useMap();
    useEffect(() => {
      map.zoomControl.setPosition("bottomright");
    }, [map]);

    return null;
  }

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      scrollWheelZoom={true}
      className="relative z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CustomZoomControl />
      <PjatkLocationMarker position={defaultPosition} />
      <UserLocationMarker />
      <Spots />
    </MapContainer>
  );
}
