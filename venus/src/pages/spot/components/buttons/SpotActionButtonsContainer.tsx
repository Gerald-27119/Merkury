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
      <li>
        <SpotActionButton
          key={0}
          onClickHandler={() => clickNavigateHandler(spotId)}
        >
          <MdOutlineNavigation />
        </SpotActionButton>
      </li>
      <li>
        <SpotActionButton
          key={1}
          onClickHandler={() => clickSaveSpotHandler(spotId)}
        >
          <MdOutlineBookmarkBorder />
        </SpotActionButton>
      </li>
      <li>
        <SpotActionButton
          key={2}
          onClickHandler={() => clickShareSpotHandler(spotId)}
        >
          <AiOutlineShareAlt />
        </SpotActionButton>
      </li>
      <li>
        <SpotActionButton
          key={3}
          onClickHandler={() => clickAddPhotoToSpotHandler(spotId)}
        >
          <MdOutlineAddPhotoAlternate />
        </SpotActionButton>
      </li>
    </ul>
  );
}
