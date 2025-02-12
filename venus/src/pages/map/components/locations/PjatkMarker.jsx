import { Marker, Popup } from "react-leaflet";

export default function PjatkLocationMarker({ position }) {
  return (
    <Marker position={position}>
      <Popup>PJATK here</Popup>
    </Marker>
  );
}
