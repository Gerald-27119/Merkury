import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";

export default function UserLocationMarker() {
  const [position, setPosition] = useState(null);

  const map = useMapEvents(
    position === null
      ? {
          click() {
            map.locate(); // Trigger location finding on map click
          },
          locationfound(e) {
            setPosition(e.latlng); // Update position state with user's location
            map.flyTo(e.latlng, map.getZoom()); // Fly to the user's location
          },
        }
      : {},
  );

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
