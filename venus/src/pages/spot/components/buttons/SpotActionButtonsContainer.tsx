import SpotActionButton from "./SpotActionButton";
import {
    MdOutlineAddPhotoAlternate,
    MdOutlineBookmark,
    MdOutlineBookmarkBorder,
    MdOutlineNavigation,
} from "react-icons/md";
import { AiOutlineShareAlt } from "react-icons/ai";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    checkSpotIsInUserFavourites,
    editFavoriteSpotList,
} from "../../../../http/user-dashboard";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { useEffect } from "react";
import { notificationAction } from "../../../../redux/notification";
import { FavoriteSpotsListType } from "../../../../model/enum/account/favorite-spots/favoriteSpotsListType";
import { FavouriteSpotListOperationType } from "../../../../model/enum/account/favorite-spots/favouriteSpotListOperationType";
import { useLocation } from "react-router-dom";
import { addSpotMediaModalActions } from "../../../../redux/add-spot-media-modal";
import SpotCoordinatesDto from "../../../../model/interface/spot/coordinates/spotCoordinatesDto";

type SpotActionButtonsContainerProps = {
    spotId: number;
    centerPoint: SpotCoordinatesDto;
};

export default function SpotActionButtonsContainer({
    spotId,
    centerPoint,
}: SpotActionButtonsContainerProps) {
    const { isLogged } = useSelectorTyped((state) => state.account);
    const spotLocationInfo = useSelectorTyped((state) => state.spotWeather);

    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    const { data, isError } = useQuery({
        queryKey: ["isSpotFavouriteCheck", spotId],
        queryFn: () => checkSpotIsInUserFavourites(spotId),
        enabled: isLogged,
    });

    const { mutateAsync } = useMutation({
        mutationFn: editFavoriteSpotList,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["favorite-spots", FavoriteSpotsListType.FAVORITE],
            });
            await queryClient.invalidateQueries({
                queryKey: ["isSpotFavouriteCheck", spotId],
            });
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message: "Failed to edit favourites spots list.",
                }),
            );
        },
    });

    useEffect(() => {
        if (isError) {
            dispatch(
                notificationAction.addError({
                    message: "Failed to check if spot is in favourites",
                }),
            );
        }
    }, [isError]);

    const clickNavigateHandler = (): void => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${centerPoint.x},${centerPoint.y}&travelmode=driving`;
                window.open(url, "_blank");
            },
            (error) => {
                let message: string;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Please allow location access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "Unable to retrieve your location.";
                        break;
                    case error.TIMEOUT:
                        message = "Location request timed out.";
                        break;
                    default:
                        message = "An unknown error occurred.";
                }
                dispatch(notificationAction.addError({ message }));
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };
    const clickSaveSpotHandler = async (spotId: number): Promise<void> => {
        if (!isLogged) {
            dispatch(
                notificationAction.addInfo({
                    message: "Please sign in to add spot to favourites",
                }),
            );
        } else {
            if (data?.isFavouriteSpot) {
                await mutateAsync({
                    type: FavoriteSpotsListType.FAVORITE,
                    operationType: FavouriteSpotListOperationType.REMOVE,
                    spotId,
                });
            } else {
                await mutateAsync({
                    type: FavoriteSpotsListType.FAVORITE,
                    operationType: FavouriteSpotListOperationType.ADD,
                    spotId,
                });
            }
        }
    };

    const location = useLocation();

    const clickShareSpotHandler = async (spotId: number): Promise<void> => {
        if (!navigator.clipboard) {
            dispatch(
                notificationAction.addInfo({
                    message: "Clipboard API not supported",
                }),
            );
            return;
        }
        try {
            await navigator.clipboard.writeText(
                `${window.location.origin}${location.pathname}?share=true&spotId=${encodeURIComponent(spotId)}&latitude=${encodeURIComponent(spotLocationInfo.latitude)}&longitude=${encodeURIComponent(spotLocationInfo.longitude)}&region=${encodeURIComponent(spotLocationInfo.region)}&city=${encodeURIComponent(spotLocationInfo.city)}`,
            );
            dispatch(
                notificationAction.addSuccess({
                    message: "Spot url copied to clipboard!",
                }),
            );
        } catch (err) {
            dispatch(
                notificationAction.addError({ message: "Failed to copy: " }),
            );
        }
    };
    const clickAddMediaToSpotHandler = (): void => {
        if (!isLogged) {
            dispatch(
                notificationAction.addInfo({
                    message: "Please sign in to add media to the spot.",
                }),
            );
        } else {
            dispatch(addSpotMediaModalActions.openAddSpotMediaModal());
        }
    };

    return (
        <ul className="mt-3 flex items-center justify-center space-x-3">
            <li key={0}>
                <SpotActionButton onClickHandler={clickNavigateHandler}>
                    <MdOutlineNavigation data-testid="navigate-to-spot-button-icon" />
                </SpotActionButton>
            </li>
            <li key={1}>
                <SpotActionButton
                    onClickHandler={() => clickSaveSpotHandler(spotId)}
                >
                    {isLogged && data?.isFavouriteSpot ? (
                        <MdOutlineBookmark />
                    ) : (
                        <MdOutlineBookmarkBorder data-testid="save-spot-button-icon" />
                    )}
                </SpotActionButton>
            </li>
            <li key={2}>
                <SpotActionButton
                    onClickHandler={() => clickShareSpotHandler(spotId)}
                >
                    <AiOutlineShareAlt data-testid="share-spot-button-icon" />
                </SpotActionButton>
            </li>
            <li key={3}>
                <SpotActionButton onClickHandler={clickAddMediaToSpotHandler}>
                    <MdOutlineAddPhotoAlternate data-testid="add-photo-button-icon" />
                </SpotActionButton>
            </li>
        </ul>
    );
}
