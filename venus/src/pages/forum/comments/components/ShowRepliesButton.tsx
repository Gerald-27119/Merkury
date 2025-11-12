import { MdKeyboardArrowDown } from "react-icons/md";
import { formatNumber } from "../../../../utils/forum/numberFormatter";

interface ShowRepliesButtonProps {
    data: number;
    onClick?: () => void;
    isOpen: boolean;
}

export default function ShowRepliesButton({
    data,
    onClick,
    isOpen,
}: ShowRepliesButtonProps) {
    return (
        <div
            className="flex cursor-pointer items-center p-2 text-lg text-blue-400 hover:underline"
            onClick={onClick}
        >
            <MdKeyboardArrowDown
                size={30}
                className={isOpen ? "rotate-180" : ""}
            />
            <p>
                {formatNumber(data)} {data > 1 ? "replies" : "reply"}
            </p>
        </div>
    );
}
