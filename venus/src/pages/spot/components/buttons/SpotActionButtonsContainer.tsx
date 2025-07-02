import SpotActionButton from "./SpotActionButton";
import {
    MdOutlineNavigation,
    MdOutlineBookmarkBorder,
    MdOutlineAddPhotoAlternate,
} from "react-icons/md";
import { AiOutlineShareAlt } from "react-icons/ai";

type SpotActionButtonsContainerProps = {
    spotId: number | null;
};
//TODO:implement handlers in another task
export default function SpotActionButtonsContainer({
    spotId,
}: SpotActionButtonsContainerProps) {
    const clickNavigateHandler = (spotId: number | null): void => {
        console.log("navigate: ", spotId);
    };
    const clickSaveSpotHandler = (spotId: number | null): void => {
        console.log("save: ", spotId);
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
                    <MdOutlineBookmarkBorder data-testid="save-spot-button-icon" />
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
