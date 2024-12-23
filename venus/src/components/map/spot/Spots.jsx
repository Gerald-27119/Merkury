import Zone from "../zone/Zone.jsx";
import { SpotsData } from "../data/spots-data.js";
import SpotDetails from "./SpotDetails.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchSpotsData } from "../../../http/spotsData.js";

export default function Spots() {
  const { data, error } = useQuery({
    queryFn: fetchSpotsData,
    queryKey: ["spots"],
  });

  if (error) {
    return <div>Error loading spots data</div>;
  }

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
