import { IoMenu } from "react-icons/io5";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import { sidebarAction } from "../../redux/sidebar";

export default function MobileBar() {
  const dispatch = useDispatchTyped();

  const handleToggle = () => dispatch(sidebarAction.toggleSidebar());

  return (
    <div className="bg-violetDark text-darkText absolute top-0 left-0 z-20 flex w-full items-center justify-between p-2 xl:hidden">
      <button onClick={handleToggle} className="ml-2 w-fit cursor-pointer">
        <IoMenu size={40} />
      </button>
      <span className="mr-2 font-semibold">Merkury</span>
    </div>
  );
}
