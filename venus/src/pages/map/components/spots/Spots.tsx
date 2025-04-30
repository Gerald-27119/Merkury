import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSpots } from "../../../../http/spots-data.js";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { notificationAction } from "../../../../redux/notification.jsx";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { Layer, Source } from "@vis.gl/react-maplibre";
import { createGeoJson } from "../../../../utils/spot-utils";
import GeneralSpot from "../../../../model/interface/spot/generalSpot";
import { AxiosError } from "axios";

export default function Spots() {
  const { name, minRating, maxRating } = useSelectorTyped(
    (state) => state.spotFilters,
  );
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
      {data?.map((spot: GeneralSpot) => (
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
              "fill-color": "#A8071A",
              "fill-opacity": 0.55,
            }}
          />
        </Source>
      ))}
    </>
  );
}
