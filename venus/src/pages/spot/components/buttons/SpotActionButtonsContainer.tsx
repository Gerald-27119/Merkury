import SpotActionButton from "./SpotActionButton";
import {
    MdOutlineNavigation,
    MdOutlineBookmarkBorder,
    MdOutlineAddPhotoAlternate,
    MdOutlineBookmark
} from "react-icons/md";
import { AiOutlineShareAlt } from "react-icons/ai";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { checkSpotIsInUserFavourites } from "../../../../http/user-dashboard";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { useEffect } from "react";
import { notificationAction } from "../../../../redux/notification";

type SpotActionButtonsContainerProps = {
    spotId: number;
};
//TODO:implement handlers in another task
export default function SpotActionButtonsContainer({
    spotId,
}: SpotActionButtonsContainerProps) {

    const {isLogged} = useSelectorTyped(state => state.account)

    const {data, isError} = useQuery({
        queryKey:["isSpotFavouriteCheck", spotId],
        queryFn: () => checkSpotIsInUserFavourites(spotId),
        enabled: isLogged
    })

    const dispatch = useDispatchTyped()

    useEffect(() => {
        if (isError) {
            dispatch(notificationAction.addError({message: "Failed to check if spots is in favourites"}))
        }
    }, [isError])

    const clickNavigateHandler = (spotId: number | null): void => {
        console.log("navigate: ", spotId);
    };
    const clickSaveSpotHandler = (spotId: number): void => {
        if (!isLogged) {
            dispatch(notificationAction.addInfo({message: "Please sign in to add spot to favourites"}))
        } else {
            //TODO: send request to add or remove
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
                    {isLogged && data?.isFavouriteSpot ?
                        <MdOutlineBookmark />
                        :
                        <MdOutlineBookmarkBorder data-testid="save-spot-button-icon" />
                    }
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
