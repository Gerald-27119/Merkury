import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserFavouriteSpots,
  removeSpotFromFavourites,
} from "../../http/spotsData.js";
import FavouriteSpot from "../../components/map/spot/FavouriteSpot.jsx";
import DefaultView from "../../components/DefaultView.jsx";

export default function FavouriteSpots() {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryFn: fetchUserFavouriteSpots,
    queryKey: ["favouriteSpots"],
  });

  const mutationRemove = useMutation({
    mutationFn: removeSpotFromFavourites,
  });

  const handleRemove = async (spotId) => {
    try {
      await mutationRemove.mutateAsync(spotId);
      await queryClient.invalidateQueries("favouriteSpots");
    } catch (error) {
      console.log("Error removing spot from favourites:", error);
    }
  };

  return (
    <DefaultView>
      <h1 className="text-center text-2xl text-white font-bold pb-8">
        Your favourite spots
      </h1>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading favourite spots</div>}

      {data && data.length > 0 ? (
        data.map((spot) => (
          <FavouriteSpot
            key={spot.id}
            spot={spot}
            handleRemove={handleRemove}
          />
        ))
      ) : (
        <p className="text-center text-gray-700">No spots available</p>
      )}
    </DefaultView>
  );
}
