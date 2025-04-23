import { Map, Source, Layer } from "@vis.gl/react-maplibre";
import type { FeatureCollection } from "geojson";
const geojson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [18.64668, 54.3514],
            [18.64668, 54.3534],
            [18.64868, 54.3534],
            [18.64868, 54.3514],
            [18.64668, 54.3514],
          ],
        ],
      },
      properties: {},
    },
  ],
};

export default function LibreMap() {
  return (
    <Map
      initialViewState={{
        longitude: 18.647680062452974,
        latitude: 54.35239970303622,
        zoom: 15,
      }}
      style={{ width: "100vw", height: "100vh" }}
      // mapStyle="https://tiles.openfreemap.org/styles/positron"
      mapStyle="/public/style1.json"
      attributionControl={false}
    >
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer
          id="polygon"
          type="fill"
          paint={{
            "fill-color": "#007cbf",
            "fill-opacity": 0.4,
          }}
        />
      </Source>
    </Map>
  );
}
