import { HiOutlineArrowsExpand } from "react-icons/hi";
import { BiDownload } from "react-icons/bi";
import { GoHeart } from "react-icons/go";

type ExpandedGalleryPanel = {
    url: string;
    likes: number;
};

export default function ExpandedGalleryPanel({
    url,
    likes,
}: ExpandedGalleryPanel) {
    return (
        <div className="bg-grayBg/15 flex w-fit items-center justify-center space-x-3 justify-self-center rounded-b-2xl px-5 py-1 text-2xl">
            <HiOutlineArrowsExpand className="cursor-pointer" />
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
