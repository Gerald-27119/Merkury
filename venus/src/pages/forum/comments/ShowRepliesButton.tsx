import { MdKeyboardArrowDown } from "react-icons/md";
import { formatNumber } from "../../../utils/forum/numberFormatter";

interface ShowRepliesButtonProps {
    data: number;
    onClick?: () => void;
}

export default function ShowRepliesButton({
    data,
    onClick,
}: ShowRepliesButtonProps) {
    return (
        <div
            className="mouse-pointer flex cursor-pointer items-center p-2 text-lg text-blue-400 hover:underline"
            onClick={onClick}
        >
            <MdKeyboardArrowDown size={30} />
            <p>{formatNumber(data)} replies</p>
        </div>
    );
}
