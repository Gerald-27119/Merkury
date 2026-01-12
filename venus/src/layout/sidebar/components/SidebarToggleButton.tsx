import { IoMenu } from "react-icons/io5";
import { sidebarAction } from "../../../redux/sidebar";
import useDispatchTyped from "../../../hooks/useDispatchTyped";

export default function SidebarToggleButton() {
    const dispatch = useDispatchTyped();

    const handleToggle = () => dispatch(sidebarAction.toggleSidebar());

    return (
        <div className="bg-violetDark mx-2 flex items-center justify-between">
            <button
                type="button"
                className="ml-2 w-fit cursor-pointer"
                onClick={handleToggle}
            >
                <IoMenu size={40} />
            </button>
            <span className="text-darkText mr-2 font-semibold xl:hidden">
                Merkury
            </span>
        </div>
    );
}
