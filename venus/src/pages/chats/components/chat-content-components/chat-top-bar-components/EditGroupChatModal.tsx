import { registerUser } from "../../../../../http/account";
import { FaX } from "react-icons/fa6";
import SocialCardList from "../../../../account/social/components/SocialCardList";
import { SocialListType } from "../../../../../model/enum/account/social/socialListType";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import { chatActions } from "../../../../../redux/chats";

interface EditGroupChatModalProps {
    onClose?: () => void;
}

export default function EditGroupChatModal({
    onClose,
}: EditGroupChatModalProps) {
    function handleCloseModal() {
        if (onClose) {
            onClose();
        }
    }

    const commonButtonsClasses =
        "px-18 py-2 hover:cursor-pointer hover:opacity-70 rounded-lg";

    return (
        <div className="relative flex h-[28rem] w-[38rem] flex-col items-center p-8">
            <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 cursor-pointer"
            >
                <FaX className="text-2xl hover:text-red-600" />
            </button>
            <div className="text-center">
                <h1 className="text-center text-2xl font-semibold">
                    Edit Chat
                </h1>
            </div>
            <div className="mt-auto flex gap-2">
                <button
                    className={`${commonButtonsClasses} bg-violetDark`}
                    onClick={handleCloseModal}
                >
                    Cancel
                </button>
                <button className={`${commonButtonsClasses} bg-green-600`}>
                    Save
                </button>
            </div>
        </div>
    );
}
