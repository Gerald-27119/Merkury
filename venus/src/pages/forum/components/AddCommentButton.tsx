import { FiPlus } from "react-icons/fi";

interface AddCommentButtonProps {
    onClick: () => void;
}

export default function AddCommentButton({ onClick }: AddCommentButtonProps) {
    return (
        <div
            className="dark:bg-violetDark bg-violetLight text-darkText dark:hover:bg-violetDarker hover:bg-violetLight ml-auto flex cursor-pointer items-center gap-1 rounded-3xl px-3 py-2 font-bold"
            onClick={onClick}
        >
            <FiPlus className="text-2xl" />
            <span className="text-base whitespace-nowrap select-none">
                Add comment
            </span>
        </div>
    );
}
