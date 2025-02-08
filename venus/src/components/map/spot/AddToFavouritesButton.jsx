import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSpotToFavourites,
  removeSpotFromFavourites,
  isSpotFavourite,
} from "../../../http/spots-data.js";
import { useDispatch } from "react-redux";
import { notificationAction } from "../../../redux/notification.jsx";
import Error from "../../error/Error.jsx";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

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
    return <Error error={error} />;
  }

  const handleClick = async () => {
    if (data) {
      await mutateRemove(spotId);
    } else {
      await mutateAdd(spotId);
    }
  };

  return (
    <div className="mb-2">
      {!data ? (
        <FaRegHeart
          className="text-red-600 cursor-pointer"
          onClick={handleClick}
          size={20}
        />
      ) : (
        <FaHeart
          className="text-red-600 cursor-pointer"
          onClick={handleClick}
          size={20}
        />
      )}
    </div>
  );
}
