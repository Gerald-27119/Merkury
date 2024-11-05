import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PjatkLocationMarker from "./PjatkMarker.jsx";
import UserLocationMarker from "./UserLocationMarker.jsx";
import Spots from "./spot/Spots.jsx";

export default function Map() {
  const position = [54.352553, 18.64745]; // Default position

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <PjatkLocationMarker position={position} />
      <UserLocationMarker />
      <Spots />
    </MapContainer>
  );
}

//TODO: add Jsdoc
