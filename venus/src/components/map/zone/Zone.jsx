import { Polygon, Popup } from "react-leaflet";
import { useDispatch } from "react-redux";
import { spotDetailsModalAction } from "../../../redux/spot-modal.jsx";

/**
 * Zone.jsx - renderuje strefę w formie wielokąta na mapie
 * z wyskakującym oknem informacyjnym.
 *
 * @component
 * @param {Object} props - Właściwości przekazywane do komponentu.
 * @param {Object} props.zone - Obiekt strefy (np.: spota dla droniarzy lub strefy ograniczonej przepisami)
 * @param {string} props.color - Kolor obramowania wielokąta.
 * @param {React.ComponentType} props.DetailsComponent - Komponent renderujący szczegóły strefy w oknie Popup.
 * @returns {JSX.Element} Element JSX przedstawiający strefę na mapie.
 */
export default function Zone({ zone, color, DetailsComponent }) {
  const dispatch = useDispatch();

  return (
    <Polygon
      pathOptions={{ color: color }}
      positions={zone.contourCoordinates}
      eventHandlers={{
        click: () => {
          dispatch(spotDetailsModalAction.handleShowModal());
          dispatch(spotDetailsModalAction.setSpot(zone));
        },
      }}
    >
      {/*<Popup>*/}
      {/*  <DetailsComponent spot={zone} />*/}
      {/*</Popup>*/}
    </Polygon>
  );
}
