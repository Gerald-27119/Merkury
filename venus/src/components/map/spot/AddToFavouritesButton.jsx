import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSpotToFavourites,
  removeSpotFromFavourites,
  isSpotFavourite,
} from "../../../http/spots-data.js";
import Button from "../../../pages/account/Button.jsx";
import { useDispatch } from "react-redux";
import { notificationAction } from "../../../redux/notification.jsx";
import JwtError from "../../../components/error/JwtError.jsx";

export default function AddToFavouritesButton({ spotId }) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data, error, isLoading } = useQuery({
    queryFn: () => isSpotFavourite(spotId),
    queryKey: ["isFavourite", spotId],
  });

  const { mutateAsync: mutateAdd } = useMutation({
    mutationFn: addSpotToFavourites,
    onSuccess: () => {
      queryClient.invalidateQueries(["isFavourite", spotId]);
      dispatch(
        notificationAction.setSuccess({
          message: "Spot added to favourites!",
        }),
      );
    },
    onError: () => {
      dispatch(
        notificationAction.setError({
          message: "Failed to add spot to favourites. Please try again later.",
        }),
      );
    },
  });

  const { mutateAsync: mutateRemove } = useMutation({
    mutationFn: removeSpotFromFavourites,
    onSuccess: () => {
      queryClient.invalidateQueries(["isFavourite", spotId]);
      dispatch(
        notificationAction.setSuccess({
          message: "Spot removed from favourites!",
        }),
      );
    },
    onError: () => {
      dispatch(
        notificationAction.setError({
          message:
            "Failed to remove spot from favourites. Please try again later.",
        }),
      );
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <JwtError error={error} />;
  }

  const handleClick = async () => {
    if (data) {
      await mutateRemove(spotId);
    } else {
      await mutateAdd(spotId);
    }
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        classNames={`p-2 rounded-md text-white ${
          data ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {!data ? "Add to favourites" : "Remove from favourites"}
      </Button>
    </div>
  );
}
