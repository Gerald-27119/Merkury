import { BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import SpotCommentVoteDisplay from "./SpotCommentVoteDisplay";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../../redux/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteComment } from "../../../../http/comments";

type SpotCommentVotesProps = {
    upvotes: number;
    downvotes: number;
    commentId: number;
};

const inActiveBtnClassNames: string =
    "absolute cursor-pointer transition-opacity hover:opacity-0";
const activeBtnClassNames: string =
    "absolute cursor-pointer opacity-0 transition-opacity hover:opacity-100";

export default function SpotCommentVotesPanel({
    upvotes,
    downvotes,
    commentId,
}: SpotCommentVotesProps) {
    const { isLogged } = useSelectorTyped((state) => state.account);
    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationKey: ["vote-comment", commentId],
        mutationFn: voteComment,
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message: "Failed to vote comment.",
                }),
            );
        },
    });

    const handleUpVoteComment = async () => {
        if (!isLogged) {
            dispatch(
                notificationAction.addInfo({
                    message: "Please sign in to vote comment.",
                }),
            );
        } else {
            await mutateAsync({ commentId, isUpvote: true });
        }
    };

    const handleDownVoteComment = async () => {
        if (!isLogged) {
            dispatch(
                notificationAction.addInfo({
                    message: "Please sign in to vote comment.",
                }),
            );
        } else {
            await mutateAsync({ commentId, isUpvote: false });
        }
    };

    return (
        <div className="mt-3 flex w-full justify-start space-x-3">
            <SpotCommentVoteDisplay votes={upvotes}>
                <BiLike className={inActiveBtnClassNames} />
                <BiSolidLike className={activeBtnClassNames} />
            </SpotCommentVoteDisplay>
            <SpotCommentVoteDisplay votes={downvotes}>
                <BiDislike className={inActiveBtnClassNames} />
                <BiSolidDislike className={activeBtnClassNames} />
            </SpotCommentVoteDisplay>
        </div>
    );
}
