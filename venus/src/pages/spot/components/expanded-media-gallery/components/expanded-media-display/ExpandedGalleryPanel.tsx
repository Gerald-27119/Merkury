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
        <div>
            <HiOutlineArrowsExpand />
            <BiDownload />
            <div>
                <GoHeart />
                <span>{likes}</span>
            </div>
        </div>
    );
}
