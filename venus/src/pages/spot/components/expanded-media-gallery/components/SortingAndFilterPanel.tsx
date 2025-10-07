import OptionButton from "./OptionButton";
import { MediaType } from "../../../../../model/enum/mediaType";
import useDispatchTyped from "../../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryAction } from "../../../../../redux/expanded-spot-media-gallery";
import { SpotExpandedGallerySortingType } from "../../../../../model/enum/spot/spotExpandedGallerySortingType";

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

    return (
        <ul>
            <li>
                <OptionButton
                    label={"Images"}
                    onClick={() => handleSetFilter(MediaType.PHOTO)}
                />
                <OptionButton
                    label={"Films"}
                    onClick={() => handleSetFilter(MediaType.VIDEO)}
                />
                <OptionButton
                    label={"Newest"}
                    onClick={() =>
                        handleSetSorting(SpotExpandedGallerySortingType.NEWEST)
                    }
                />
                <OptionButton
                    label={"Oldest"}
                    onClick={() =>
                        handleSetSorting(SpotExpandedGallerySortingType.OLDEST)
                    }
                />
                <OptionButton
                    label={"Most Liked"}
                    onClick={() =>
                        handleSetSorting(
                            SpotExpandedGallerySortingType.MOST_LIKED,
                        )
                    }
                />
            </li>
        </ul>
    );
}
