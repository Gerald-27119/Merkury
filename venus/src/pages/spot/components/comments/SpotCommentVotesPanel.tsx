import { BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import SpotCommentVoteDisplay from "./SpotCommentVoteDisplay";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../../redux/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSpotCommentVoteInfo, voteComment } from "../../../../http/comments";
import { useEffect, useState } from "react";
import { SpotCommentVoteType } from "../../../../model/enum/spot/spotCommentVoteType";

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
    const [voteType, setVoteType] = useState<SpotCommentVoteType>(
        SpotCommentVoteType.NONE,
    );

    const { isLogged } = useSelectorTyped((state) => state.account);
    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    const { data, isSuccess } = useQuery({
        queryKey: ["get-spot-comment-vote-info", commentId],
        queryFn: () => getSpotCommentVoteInfo(commentId),
        enabled: isLogged,
    });

    const { mutateAsync } = useMutation({
        mutationKey: ["vote-comment", commentId],
        mutationFn: voteComment,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["get-spot-comment-vote-info", commentId],
            });
        },
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

    useEffect(() => {
        if (isSuccess && data) {
            setVoteType(data.voteInfo);
        }
    }, [data, isSuccess]);

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
