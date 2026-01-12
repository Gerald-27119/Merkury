import { FaPlus } from "react-icons/fa6";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { addSpotCommentModalInfoActions } from "../../../../redux/add-spot-comment-modal-info";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { notificationAction } from "../../../../redux/notification";

type SpotCommentHeaderProps = {
    spotName: string;
};

export default function SpotCommentHeader({
    spotName,
}: SpotCommentHeaderProps) {
    const dispatch = useDispatchTyped();
    const { isLogged } = useSelectorTyped((state) => state.account);

    const handleClickAddComment = () => {
        if (isLogged) {
            dispatch(
                addSpotCommentModalInfoActions.openAddSpotCommentModal(
                    spotName,
                ),
            );
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Please sign in to add comment.",
                }),
            );
        }
    };

    return (
        <div className="dark:bg-violetDark dark:text-darkText text-violetDark w-full rounded-t-xl bg-white pt-2 pb-4">
            <div className="mx-4 mt-4 flex items-center justify-between">
                <h3 className="font-bold">Comments</h3>
                <button
                    onClick={handleClickAddComment}
                    className="dark:bg-violetDarker hover:bg-whiteSmoke dark:ring-violetBtnBorderDark/50 dark:hover:bg-violetLight flex w-fit cursor-pointer items-center rounded-full px-2 py-1 ring-2 2xl:px-3 2xl:py-2 2xl:text-xl"
                >
                    <FaPlus className="text-sm 2xl:text-xl" />
                    <span className="ml-1.5 2xl:ml-2">Add</span>
                </button>
            </div>
        </div>
    );
}
