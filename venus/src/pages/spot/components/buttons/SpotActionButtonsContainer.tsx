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

type SpotActionButtonsContainerProps = {
    spotId: number;
};

export default function SpotActionButtonsContainer({
    spotId,
}: SpotActionButtonsContainerProps) {
    const { isLogged } = useSelectorTyped((state) => state.account);

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
            await queryClient.invalidateQueries({queryKey:["isSpotFavouriteCheck", spotId]})
        },
        onError: () => {
            dispatch(notificationAction.addError({message: "Failed to edit favourites spots list."}))
        }
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

    const clickNavigateHandler = (spotId: number | null): void => {
        console.log("navigate: ", spotId);
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
                    spotId
                });
            } else {
               await mutateAsync({
                    type: FavoriteSpotsListType.FAVORITE,
                    operationType: FavouriteSpotListOperationType.ADD,
                    spotId
                });
            }
        }
    };
    const clickShareSpotHandler = (spotId: number | null): void => {
        console.log("share: ", spotId);
    };
    const clickAddPhotoToSpotHandler = (spotId: number | null): void => {
        console.log("addPhoto: ", spotId);
    };

    return (
        <ul className="mt-3 flex items-center justify-center space-x-3">
            <li key={0}>
                <SpotActionButton
                    onClickHandler={() => clickNavigateHandler(spotId)}
                >
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
                <SpotActionButton
                    onClickHandler={() => clickAddPhotoToSpotHandler(spotId)}
                >
                    <MdOutlineAddPhotoAlternate data-testid="add-photo-button-icon" />
                </SpotActionButton>
            </li>
        </ul>
    );
}
