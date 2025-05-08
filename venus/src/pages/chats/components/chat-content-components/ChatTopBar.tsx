import { FaPhotoVideo } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

export default function ChatTopBar() {
    // for development purposes
    const className: string = "text-2xl";
    return (
        <div className="bg-violetDark flex items-center justify-between gap-4 px-4 py-5">
            <p>chat x</p>
            <div className="mr-2 flex items-center justify-center gap-5">
                <FaSearch className={className} />
                <FaPhotoVideo className={className} />
            </div>
        </div>
    );
}
