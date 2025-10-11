import OptionButton from "../expanded-media-display/OptionButton";
import { MediaType } from "../../../../../../model/enum/mediaType";
import useDispatchTyped from "../../../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryAction } from "../../../../../../redux/expanded-spot-media-gallery";
import { SpotExpandedGallerySortingType } from "../../../../../../model/enum/spot/spotExpandedGallerySortingType";
import useSelectorTyped from "../../../../../../hooks/useSelectorTyped";

export default function SortingAndFilterPanel() {
    const dispatch = useDispatchTyped();

    const handleSetFilter = (mediaType: MediaType) => {
        dispatch(
            expandedSpotMediaGalleryAction.setExpandedGalleryMediaType({
                mediaType,
            }),
        );
    };

    const handleSetSorting = (sorting: SpotExpandedGallerySortingType) => {
        dispatch(
            expandedSpotMediaGalleryAction.setExpandedGallerySorting({
                sorting: sorting,
            }),
        );
    };

    const { mediaType, sorting } = useSelectorTyped(
        (state) => state.expandedSpotMediaGallery,
    );

    return (
        <ul>
            <li>
                <OptionButton
                    label={"Images"}
                    onClick={() => handleSetFilter(MediaType.PHOTO)}
                    isSelected={mediaType === MediaType.PHOTO}
                />
                <OptionButton
                    label={"Films"}
                    onClick={() => handleSetFilter(MediaType.VIDEO)}
                    isSelected={mediaType === MediaType.VIDEO}
                />
                <OptionButton
                    label={"Newest"}
                    onClick={() =>
                        handleSetSorting(SpotExpandedGallerySortingType.NEWEST)
                    }
                    isSelected={
                        sorting === SpotExpandedGallerySortingType.NEWEST
                    }
                />
                <OptionButton
                    label={"Oldest"}
                    onClick={() =>
                        handleSetSorting(SpotExpandedGallerySortingType.OLDEST)
                    }
                    isSelected={
                        sorting === SpotExpandedGallerySortingType.OLDEST
                    }
                />
                <OptionButton
                    label={"Most Liked"}
                    onClick={() =>
                        handleSetSorting(
                            SpotExpandedGallerySortingType.MOST_LIKED,
                        )
                    }
                    isSelected={
                        sorting === SpotExpandedGallerySortingType.MOST_LIKED
                    }
                />
            </li>
        </ul>
    );
}
