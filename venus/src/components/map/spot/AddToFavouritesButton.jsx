import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSpotToFavourites,
  removeSpotFromFavourites,
  isSpotFavourite,
} from "../../../http/spotsData.js";
import Button from "../../../pages/account/Button.jsx";

export default function AddTofavouritesButton({ spotId }) {
  const queryClient = useQueryClient();

  const { data, error } = useQuery({
    queryFn: () => isSpotFavourite(spotId),
    queryKey: ["isFavourite", spotId],
  });

  const mutationAdd = useMutation({
    mutationFn: addSpotToFavourites,
  });

  const mutationRemove = useMutation({
    mutationFn: removeSpotFromFavourites,
  });

  const handleAdd = async () => {
    try {
      await mutationAdd.mutateAsync(spotId);
      await queryClient.invalidateQueries(["isFavourite", spotId]);
    } catch (error) {
      console.log("Error adding spot to favourites:", error);
    }
  };

  const handleRemove = async () => {
    try {
      await mutationRemove.mutateAsync(spotId);
      await queryClient.invalidateQueries(["isFavourite", spotId]);
    } catch (error) {
      console.log("Error removing spot from favourites:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={!data ? handleAdd : handleRemove}
        classNames={`p-2 rounded-md text-white ${
          data ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {!data ? "Add to favourites" : "Remove from favourites"}
      </Button>
    </div>
  );
}
