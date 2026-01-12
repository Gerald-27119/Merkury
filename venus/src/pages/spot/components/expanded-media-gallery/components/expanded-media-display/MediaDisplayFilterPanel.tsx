import { BiImages, BiMoviePlay } from "react-icons/bi";
import useDispatchTyped from "../../../../../../hooks/useDispatchTyped";
import { MediaType } from "../../../../../../model/enum/mediaType";
import { expandedSpotMediaGalleryAction } from "../../../../../../redux/expanded-spot-media-gallery";
import useSelectorTyped from "../../../../../../hooks/useSelectorTyped";

export default function MediaDisplayFilterPanel() {
    const dispatch = useDispatchTyped();

    const { mediaType } = useSelectorTyped(
        (state) => state.expandedSpotMediaGallery,
    );

    const handleSetMediaType = (mediaType: MediaType) => {
        dispatch(
            expandedSpotMediaGalleryAction.setExpandedGalleryMediaType({
                mediaType,
            }),
        );
    };

    return (
        <div className="relative flex items-center text-3xl">
            <div
                className={`${mediaType === MediaType.PHOTO ? "bg-grayBg/70" : "bg-black/70"} cursor-pointer rounded-bl-2xl px-2 py-1`}
            >
                <BiImages onClick={() => handleSetMediaType(MediaType.PHOTO)} />
            </div>
            <div
                className={`${mediaType === MediaType.VIDEO ? "bg-grayBg/70" : "bg-black/70"} cursor-pointer rounded-br-2xl px-2 py-1`}
            >
                <BiMoviePlay
                    onClick={() => handleSetMediaType(MediaType.VIDEO)}
                />
            </div>
            <hr className="absolute top-1 left-[2.84rem] z-2 h-7 w-0.5 rounded-2xl bg-white" />
        </div>
    );
}
