import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { IoClose } from "react-icons/io5";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryFullscreenSizeActions } from "../../../../redux/expanded-spot-media-gallery-fullscreen-size";
import { MediaType } from "../../../../model/enum/mediaType";

//TODO add video display and animation
export default function FullscreenMediaModal() {
    const { url, mediaType } = useSelectorTyped(
        (state) => state.expandedSpotGalleryCurrentMedia,
    );

    const dispatch = useDispatchTyped();

    const handleCloseFullscreenModal = () => {
        dispatch(expandedSpotMediaGalleryFullscreenSizeActions.setNormalSize());
    };

    return (
        <div className="absolute top-0 z-[4] flex h-full w-full flex-col items-center bg-black">
            <IoClose
                onClick={handleCloseFullscreenModal}
                className="text-darkText mt-2 ml-auto cursor-pointer text-2xl"
            />
            <div className="flex h-full items-center">
                {mediaType === MediaType.PHOTO ? (
                    <img
                        alt={url}
                        src={url}
                        className="max-h-full max-w-full"
                    />
                ) : (
                    <p>video</p>
                )}
            </div>
        </div>
    );
}
