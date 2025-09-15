import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    addSpotToFavourites,
    removeSpotFromFavourites,
    isSpotFavourite,
} from "../../../../http/spots-data.ts";
import { useDispatch } from "react-redux";
import { notificationAction } from "../../../../redux/notification";
import Error from "../../../../components/error/Error.jsx";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner.jsx";

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
                notificationAction.addSuccess({
                    message: "Spot added to favourites!",
                }),
            );
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message:
                        "Failed to add spot to favourites. Please try again later.",
                }),
            );
        },
    });

    const { mutateAsync: mutateRemove } = useMutation({
        mutationFn: removeSpotFromFavourites,
        onSuccess: () => {
            queryClient.invalidateQueries(["isFavourite", spotId]);
            dispatch(
                notificationAction.addSuccess({
                    message: "Spot removed from favourites!",
                }),
            );
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message:
                        "Failed to remove spot from favourites. Please try again later.",
                }),
            );
        },
    });

    if (isLoading) {
        return <LoadingSpinner />;
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
                    className="cursor-pointer text-red-600"
                    onClick={handleClick}
                    size={20}
                />
            ) : (
                <FaHeart
                    className="cursor-pointer text-red-600"
                    onClick={handleClick}
                    size={20}
                />
            )}
        </div>
    );
}
