import { FiPlus } from "react-icons/fi";

interface AddPostButtonProps {
    onClick: () => void;
}

export default function AddPostButton({ onClick }: AddPostButtonProps) {
    return (
        <div
            className="dark:bg-violetDark bg-violetLight text-darkText dark:hover:bg-violetDarker hover:bg-violetLight mb-4 flex w-42 cursor-pointer items-center gap-1 rounded-2xl p-2 font-bold select-none"
            onClick={onClick}
        >
            <FiPlus className="text-2xl" />
            <span className="text-base whitespace-nowrap">New Discussion</span>
        </div>
    );
}
