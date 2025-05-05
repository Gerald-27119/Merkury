import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSpots } from "../../../../http/spots-data.js";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { notificationAction } from "../../../../redux/notification.jsx";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { Layer, Marker, Source } from "@vis.gl/react-maplibre";
import {
  createGeoJson,
  shouldRenderMarker,
} from "../../../../utils/spot-utils";
import GeneralSpot from "../../../../model/interface/spot/generalSpot";
import { AxiosError } from "axios";
import { MdLocationPin } from "react-icons/md";

export default function Spots() {
  const { name, minRating, maxRating } = useSelectorTyped(
    (state) => state.spotFilters,
  );
  const { zoomLevel } = useSelectorTyped((state) => state.map);
  const dispatch = useDispatch();

  const { data, error } = useQuery({
    queryFn: () => fetchFilteredSpots(name, minRating, maxRating),
    queryKey: ["spots", "filter", name, minRating, maxRating],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if ((error as AxiosError)?.response?.data) {
      dispatch(
        notificationAction.setError({
          message: (error as AxiosError).response?.data,
        }),
      );
    }
  }, [dispatch, error]);

  return (
    <>
      {data?.map((spot: GeneralSpot) =>
        shouldRenderMarker(spot.area, zoomLevel) ? (
          <Marker
            key={spot.id}
            longitude={spot.contourCoordinates[0][1]}
            latitude={spot.contourCoordinates[0][0]}
          >
            <MdLocationPin
              className="text-spotLocationMarker text-3xl"
              key={spot.id}
            />
          </Marker>
        ) : (
          <Source
            key={spot.id}
            id={spot.id.toString()}
            type="geojson"
            data={createGeoJson(spot)}
          >
            <Layer
              id={spot.id.toString()}
              type="fill"
              paint={{
                "fill-color": spot.areaColor,
                "fill-opacity": 0.55,
              }}
            />
          </Source>
        ),
      )}
    </>
  );
}
