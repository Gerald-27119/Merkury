import { Polygon, Popup } from "react-leaflet";

export default function Zone({ zone, color, DetailsComponent }) {
  return (
    <Polygon pathOptions={{ color: color }} positions={zone.contourCoordinates}>
      <Popup>
        <DetailsComponent spot={zone} />
      </Popup>
    </Polygon>
  );
}
//TODO: add Jsdoc
