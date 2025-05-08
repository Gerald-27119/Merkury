import MessageInput from "./bottom-bar-components/MessageInput";
import { FaCirclePlus } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { RiEmotionHappyFill } from "react-icons/ri";
import { MdGifBox } from "react-icons/md";

export default function ChatBottomBar() {
    const className = "text-violetLighter text-3xl";

    return (
        <div className="flex items-center justify-center gap-4 px-3 py-3">
            <div className="bg-violetLight/25 mr-1 flex w-full gap-3 rounded-xl px-3 py-3 shadow-md">
                <FaCirclePlus className={className} />
                <MessageInput />
                <MdGifBox className={className} />
                <RiEmotionHappyFill className={className} />
            </div>
            <IoSendSharp className="mr-4 h-7 w-7 shadow-md" />
        </div>
    );
}
