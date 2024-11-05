import { Polygon, Popup } from "react-leaflet";
import PropTypes from "prop-types";

export default function Zone({ zone, color, DetailsComponent }) {
  return (
    <Polygon pathOptions={{ color: color }} positions={zone.contourCoordinates}>
      <Popup>
        <DetailsComponent spot={zone} />
      </Popup>
    </Polygon>
  );
}

Zone.propTypes = {
  zone: PropTypes.shape({
    contourCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
      .isRequired,
  }).isRequired,
  color: PropTypes.string.isRequired,
  DetailsComponent: PropTypes.elementType.isRequired,
};

//TODO: add Jsdoc
