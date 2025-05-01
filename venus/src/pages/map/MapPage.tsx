import { Map } from "@vis.gl/react-maplibre";
import ZoomControlPanel from "./components/ZoomControlPanel";
import UserLocationPanel from "./components/UserLocationPanel";
import Spots from "./components/spots/Spots";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import { mapAction } from "../../redux/map";

type Position = {
  longitude: number;
  latitude: number;
};

const defaultPosition: Position = {
  longitude: 18.64745,
  latitude: 54.352553,
};
export default function MapPage() {
  const dispatch = useDispatchTyped();
  const handleZoomEnd = (event: any) => {
    dispatch(mapAction.setZoomLevel(event.target.getZoom()));
  };

  return (
    <Map
      initialViewState={{
        ...defaultPosition,
        zoom: 15,
      }}
      dragRotate={false}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
      mapStyle="/map_style1.json"
      attributionControl={false}
      onZoomEnd={handleZoomEnd}
    >
      <UserLocationPanel />
      <ZoomControlPanel />
      <Spots />
    </Map>
  );
}
