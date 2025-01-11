import Zone from "../zone/Zone.jsx";
import { SpotsData } from "../data/spots-data.js";
import SpotDetails from "./SpotDetails.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSpots } from "../../../http/spotsData.js";
import { useSelector } from "react-redux";

export default function Spots() {
  const { name, minRating, maxRating } = useSelector(
    (state) => state.spotFilters,
  );

  const { data, error } = useQuery({
    queryFn: () => fetchFilteredSpots(name, minRating, maxRating),
    queryKey: ["spots", "filter", name, minRating, maxRating],
  });

  if (error) {
    return <div>Error loading spots data</div>;
  }
  // For Testing
  // return (
  //   <>
  //     {SpotsData.map((spot) => (
  //       <Zone
  //         key={spot.id}
  //         zone={spot}
  //         color="green"
  //         DetailsComponent={SpotDetails}
  //       />
  //     ))}
  //   </>
  // );

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
