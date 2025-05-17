import { IoMenu } from "react-icons/io5";

interface SidebarToggleButtonProps {
  onToggle: () => void;
}

export default function SidebarToggleButton({
  onToggle,
}: SidebarToggleButtonProps) {
  return (
    <div className="bg-violetDark mx-2 flex items-center justify-between">
      <button
        type="button"
        className="ml-2 w-fit cursor-pointer"
        onClick={onToggle}
      >
        <IoMenu size={40} />
      </button>
      <span className="text-darkText mr-2 font-semibold xl:hidden">
        Merkury
      </span>
    </div>
  );
}
