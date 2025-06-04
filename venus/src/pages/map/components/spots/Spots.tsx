import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSpots } from "../../../../http/spots-data.js";
import { useEffect } from "react";
import { notificationAction } from "../../../../redux/notification.jsx";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { Layer, Marker, Source, useMap } from "@vis.gl/react-maplibre";
import {
  createGeoJson,
  shouldRenderMarker,
} from "../../../../utils/spot-utils";
import GeneralSpot from "../../../../model/interface/spot/generalSpot";
import { AxiosError } from "axios";
import { MdLocationPin } from "react-icons/md";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { spotDetailsModalAction } from "../../../../redux/spot-modal";
import { useLocation } from "react-router-dom";

const clickHandlers = new Map<number, () => void>();

export default function Spots() {
  const { name, minRating, maxRating } = useSelectorTyped(
    (state) => state.spotFilters,
  );
  const { zoomLevel } = useSelectorTyped((state) => state.map);
  const dispatch = useDispatchTyped();
  const { current: map } = useMap();
  const location = useLocation();

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

  useEffect(() => {
    if (!map) return;

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    if (data) {
      data?.forEach((spot: GeneralSpot) => {
        if (!shouldRenderMarker(spot.area, zoomLevel)) {
          const handler = () => handleSpotClick(spot.id);
          const layerId = spot.id.toString();
          clickHandlers.set(spot.id, handler);
          map?.on("click", layerId, handler);
          map?.on("mouseenter", layerId, handleMouseEnter);
          map?.on("mouseleave", layerId, handleMouseLeave);
        }
      });
    }
    return () => {
      if (data) {
        data?.forEach((spot: GeneralSpot) => {
          if (!shouldRenderMarker(spot.area, zoomLevel)) {
            const handler = clickHandlers.get(spot.id);
            const layerId = spot.id.toString();
            if (handler) {
              map?.off("click", layerId, handler);
              clickHandlers.delete(spot.id);
            }
            map?.off("mouseenter", layerId, handleMouseEnter);
            map?.off("mouseleave", layerId, handleMouseLeave);
            map.getCanvas().style.cursor = "";
          }
        });
      }
    };
  }, [map, data, zoomLevel]);

  useEffect(() => {
    if (!map || !location.state) return;

    const spotCoords = location.state.spotCoords;

    if (spotCoords) {
      map.flyTo({
        center: [spotCoords.y, spotCoords.x],
        zoom: 16,
        speed: 1.5,
      });
    }
  }, [map, location]);

  const handleSpotClick = (spotId: number): void => {
    dispatch(spotDetailsModalAction.setSpotId(spotId));
    dispatch(spotDetailsModalAction.handleShowModal());
  };

  return (
    <>
      {data?.map((spot: GeneralSpot) =>
        shouldRenderMarker(spot.area, zoomLevel) ? (
          <Marker
            key={spot.id}
            longitude={spot.contourCoordinates[0][1]}
            latitude={spot.contourCoordinates[0][0]}
            onClick={() => handleSpotClick(spot.id)}
          >
            <MdLocationPin
              className="text-spotLocationMarker cursor-pointer text-3xl"
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
