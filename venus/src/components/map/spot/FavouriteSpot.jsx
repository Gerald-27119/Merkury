import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeSpotFromFavourites } from "../../../http/spots-data.js";
import Button from "../../../pages/account/Button.jsx";
import { notificationAction } from "../../../redux/notification.jsx";
import { useDispatch } from "react-redux";

export default function FavouriteSpot({ spot, currentPage, onRemove }) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutateAsync: mutateRemove } = useMutation({
    mutationFn: removeSpotFromFavourites,
    onSuccess: () => {
      queryClient.invalidateQueries(["favouriteSpots", currentPage]);
      dispatch(
        notificationAction.setSuccess({
          message: "Spot removed from favourites successfully!",
        }),
      );
      onRemove();
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

  const handleRemove = async () => {
    await mutateRemove(spot.id);
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-md p-4 mb-4 shadow-md">
      {spot.photos && spot.photos.length > 0 ? (
        <img
          src={spot.photos[0].img}
          alt={spot.photos[0].title}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm text-gray-500">No Image</span>
        </div>
      )}

      <p className="flex-1 px-4 text-gray-800 font-medium">{spot.name}</p>

      <Button
        classNames="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
        onClick={handleRemove}
      >
        Remove
      </Button>
    </div>
  );
}
