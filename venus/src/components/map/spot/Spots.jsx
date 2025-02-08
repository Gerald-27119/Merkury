import Zone from "../zone/Zone.jsx";
import SpotDetails from "./SpotDetails.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSpots } from "../../../http/spots-data.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { notificationAction } from "../../../redux/notification.jsx";

export default function Spots() {
  const { name, minRating, maxRating } = useSelector(
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
    if (error?.response?.data) {
      dispatch(
        notificationAction.setError({
          message: error.response.data,
        }),
      );
    }
  }, [dispatch, error]);

  return (
    <>
      {data?.map((spot) => (
        <Zone
          key={spot.id}
          zone={spot}
          color={spot.areaColor}
          DetailsComponent={SpotDetails}
        />
      ))}
    </>
  );
}
