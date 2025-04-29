import GeneralSpot from "../model/interface/spot/generalSpot";
import type { FeatureCollection } from "geojson";

export function formatPublishDate(publishDate) {
  const date = new Date(publishDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function createGeoJson(spot: GeneralSpot): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              ...spot.contourCoordinates.map(
                ([latitude, longitude]: number[]) => [longitude, latitude],
              ),
            ],
          ],
        },
        properties: {},
      },
    ],
  };
}
