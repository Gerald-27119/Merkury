import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import classes from "./Map.module.css";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const position = [54.352553, 18.64745];
  return (
    <section className={classes.mapSection}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className={classes.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </section>
  );
}
