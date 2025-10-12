import { HiOutlineArrowsExpand } from "react-icons/hi";
import { BiDownload } from "react-icons/bi";
import { GoHeart } from "react-icons/go";

type ExpandedGalleryPanel = {
    id: number;
    likes: number;
};

export default function ExpandedGalleryPanel({
    id,
    likes,
}: ExpandedGalleryPanel) {
    return (
        <div className="bg-grayBg/15 flex w-fit items-center justify-center space-x-3 justify-self-center rounded-b-2xl px-6 py-1">
            <HiOutlineArrowsExpand />
            <BiDownload />
            <div className="flex items-center space-x-1">
                <GoHeart />
                <span>{likes}</span>
            </div>
        </div>
    );
}
