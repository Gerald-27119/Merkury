import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeSpotFromFavourites } from "../../http/spots-data.ts";
import { notificationAction } from "../../redux/notification.jsx";
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
    <div className="mb-4 flex items-center justify-between rounded-md bg-white p-4 shadow-md">
      {spot.img ? (
        <img
          src={spot.img.img}
          alt={spot.img.title}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
          <span className="text-sm text-gray-500">No Image</span>
        </div>
      )}

      <p className="flex-1 px-4 font-medium text-gray-800">{spot.name}</p>

      <button
        className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
        onClick={handleRemove}
      >
        Remove
      </button>
    </div>
  );
}
