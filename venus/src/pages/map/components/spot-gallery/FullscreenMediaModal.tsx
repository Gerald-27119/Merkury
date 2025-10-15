import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { IoClose } from "react-icons/io5";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryFullscreenSizeActions } from "../../../../redux/expanded-spot-media-gallery-fullscreen-size";
import { MediaType } from "../../../../model/enum/mediaType";

//TODO add video display and animation center media
export default function FullscreenMediaModal() {
    const { url, mediaType } = useSelectorTyped(
        (state) => state.expandedSpotGalleryCurrentMedia,
    );

    const dispatch = useDispatchTyped();

    const handleCloseFullscreenModal = () => {
        dispatch(expandedSpotMediaGalleryFullscreenSizeActions.setNormalSize());
    };

    return (
        <div className="absolute top-0 z-[6] flex h-full w-full flex-col items-end justify-center bg-black">
            <IoClose
                onClick={handleCloseFullscreenModal}
                className="text-darkText cursor-pointer text-2xl"
            />
            {mediaType === MediaType.PHOTO ? (
                <img alt={url} src={url} className="max-h-full max-w-full" />
            ) : (
                <p>video</p>
            )}
        </div>
    );
}
