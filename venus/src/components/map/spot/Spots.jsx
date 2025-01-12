import Zone from "../zone/Zone.jsx";
import SpotDetails from "./SpotDetails.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchSpotsData } from "../../../http/spotsData.js";

export default function Spots() {
  const { data, error } = useQuery({
    queryFn: fetchSpotsData,
    queryKey: ["spots"],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
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
