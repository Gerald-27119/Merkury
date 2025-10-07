import { IoClose } from "react-icons/io5";
import SortingAndFilterPanel from "./SortingAndFilterPanel";

export default function ExpandedGallerySidebar() {
    return (
        <div>
            <div className="flex">
                <h2>Gallery</h2>
                <IoClose />
            </div>
            <SortingAndFilterPanel />
            <ul>{/*media*/}</ul>
        </div>
    );
}
