import { AiOutlineShareAlt } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import useDispatchTyped from "../../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryModalsActions } from "../../../../../redux/expanded-spot-media-gallery-modals";

export default function ExpandedMediaGalleryActions() {
    const dispatch = useDispatchTyped();

    const handleClickCloseModals = () => {
        dispatch(expandedSpotMediaGalleryModalsActions.closeModals());
    };

    return (
        <div className="flex items-center space-x-2">
            <div className="flex cursor-pointer items-center space-x-1">
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
