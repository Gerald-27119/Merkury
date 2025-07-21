import { FaEye, FaHeart } from "react-icons/fa";
import Media from "../../../../model/interface/account/media/media";

interface PhotoProps {
    photo: Media;
}

export default function Photo({ photo }: PhotoProps) {
    return (
        <li className="group relative">
            <img
                className="aspect-square h-64 w-full rounded-md object-cover drop-shadow-md"
                src={photo.src}
                alt="user-photo"
            />
            <div className="group-hover:bg-lightBg/70 dark:group-hover:bg-darkBg/60 absolute bottom-0 left-0 flex w-full justify-center gap-4 rounded-b-md py-2 text-xl transition duration-300">
                <span className="flex items-center gap-2">
                    <FaHeart />
                    {photo.heartsCount}
                </span>
                <span className="flex items-center gap-2">
                    <FaEye />
                    {photo.viewsCount}
                </span>
            </div>
        </li>
    );
}
