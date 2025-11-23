import { AiOutlineShareAlt } from "react-icons/ai";
import useDispatchTyped from "../../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryModalsActions } from "../../../../../redux/expanded-spot-media-gallery-modals";
import { IoClose } from "react-icons/io5";
import { notificationAction } from "../../../../../redux/notification";
import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { expandedSpotGalleryMediaListAction } from "../../../../../redux/expanded-spot-gallery-media-list";

export default function ExpandedMediaGalleryActions() {
    const dispatch = useDispatchTyped();

    const handleClickCloseModals = () => {
        dispatch(expandedSpotMediaGalleryModalsActions.closeModals());
        dispatch(expandedSpotGalleryMediaListAction.clearMediaList());
    };

    const mediaUrl = useSelectorTyped(
        (state) => state.expandedSpotGalleryCurrentMedia.url,
    );

    const handleClickShare = async (mediaUrl: string) => {
        if (!navigator.clipboard) {
            dispatch(
                notificationAction.addInfo({
                    message: "Clipboard API not supported",
                }),
            );
            return;
        }
        try {
            await navigator.clipboard.writeText(mediaUrl);
            dispatch(
                notificationAction.addSuccess({
                    message: "Media url copied to clipboard!",
                }),
            );
        } catch (err) {
            dispatch(
                notificationAction.addError({ message: "Failed to copy: " }),
            );
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <div
                className="hover:bg-grayBg/40 flex cursor-pointer items-center space-x-1 rounded-2xl py-0.5 pr-3 pl-2"
                onClick={() => handleClickShare(mediaUrl)}
            >
                <AiOutlineShareAlt className="text-2xl" />
                <span>Share</span>
            </div>
            <IoClose
                onClick={handleClickCloseModals}
                className="cursor-pointer text-3xl"
            />
        </div>
    );
}
