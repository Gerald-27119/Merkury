import { HiOutlineArrowsExpand } from "react-icons/hi";
import { BiDownload } from "react-icons/bi";
import { GoHeart } from "react-icons/go";
import useDispatchTyped from "../../../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryFullscreenSizeActions } from "../../../../../../redux/expanded-spot-media-gallery-fullscreen-size";

type ExpandedGalleryPanel = {
    url: string;
    likes: number;
    spotMediaId: number;
};

export default function ExpandedGalleryPanel({
    url,
    likes,
    spotMediaId,
}: ExpandedGalleryPanel) {
    const dispatch = useDispatchTyped();

    const handleSetMediaFullscreen = () => {
        dispatch(expandedSpotMediaGalleryFullscreenSizeActions.setFullScreen());
    };

    return (
        <div className="bg-grayBg/15 flex w-fit items-center justify-center space-x-3 justify-self-center rounded-b-2xl px-5 py-1 text-2xl">
            <HiOutlineArrowsExpand
                className="cursor-pointer"
                onClick={handleSetMediaFullscreen}
            />
            <a href={url}>
                <BiDownload className="cursor-pointer" />
            </a>
            <div className="flex items-center space-x-1">
                <GoHeart className="cursor-pointer" />
                <span>{likes}</span>
            </div>
        </div>
    );
}
