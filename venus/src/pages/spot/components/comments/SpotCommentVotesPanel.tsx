import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
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

type VoteCounterType = {
    upVotes: number;
    downVotes: number;
};

const baseIconClass =
    "absolute cursor-pointer transition-opacity duration-200 ease-in-out";
const visible = "opacity-100";
const hidden = "opacity-0 group-hover:opacity-100";

export default function SpotCommentVotesPanel({
    upvotes,
    downvotes,
    commentId,
}: SpotCommentVotesProps) {
    const [voteType, setVoteType] = useState<SpotCommentVoteType>(
        SpotCommentVoteType.NONE,
    );
    const [voteCounter, setVoteCounter] = useState<VoteCounterType>({
        upVotes: upvotes,
        downVotes: downvotes,
    });

    const { isLogged } = useSelectorTyped((state) => state.account);
    const { spotId } = useSelectorTyped((state) => state.spotDetails);
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
            await queryClient.invalidateQueries({
                queryKey: ["spot-comments", spotId],
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
            setVoteCounter((prevState) => ({
                upVotes:
                    voteType === SpotCommentVoteType.UP_VOTE
                        ? prevState.upVotes - 1
                        : prevState.upVotes + 1,
                downVotes:
                    voteType === SpotCommentVoteType.DOWN_VOTE
                        ? prevState.downVotes - 1
                        : prevState.downVotes,
            }));
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
            setVoteCounter((prevState) => ({
                upVotes:
                    voteType === SpotCommentVoteType.UP_VOTE
                        ? prevState.upVotes - 1
                        : prevState.upVotes,
                downVotes:
                    voteType === SpotCommentVoteType.DOWN_VOTE
                        ? prevState.downVotes - 1
                        : prevState.downVotes + 1,
            }));
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
            <SpotCommentVoteDisplay votes={voteCounter.upVotes}>
                <BiLike
                    className={`${baseIconClass} ${
                        voteType === SpotCommentVoteType.UP_VOTE
                            ? hidden
                            : visible
                    }`}
                    onClick={handleUpVoteComment}
                />
                <BiSolidLike
                    className={`${baseIconClass} ${
                        voteType === SpotCommentVoteType.UP_VOTE
                            ? visible
                            : hidden
                    }`}
                    onClick={handleUpVoteComment}
                />
            </SpotCommentVoteDisplay>
            <SpotCommentVoteDisplay votes={voteCounter.downVotes}>
                <BiDislike
                    className={`${baseIconClass} ${
                        voteType === SpotCommentVoteType.DOWN_VOTE
                            ? hidden
                            : visible
                    }`}
                    onClick={handleDownVoteComment}
                />
                <BiSolidDislike
                    className={`${baseIconClass} ${
                        voteType === SpotCommentVoteType.DOWN_VOTE
                            ? visible
                            : hidden
                    }`}
                    onClick={handleDownVoteComment}
                />
            </SpotCommentVoteDisplay>
        </div>
    );
}
