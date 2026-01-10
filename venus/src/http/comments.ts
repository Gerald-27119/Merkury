import axios from "axios";
import SpotCommentPage from "../model/interface/spot/comment/spotCommentPage";
import SpotCommentVoteInfoDto from "../model/interface/spot/comment/spotCommentVoteInfoDto";
import AddSpotCommentDto from "../model/interface/spot/comment/AddSpotCommentDto";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getPaginatedSpotComments(
    spotId: number,
    page: number,
): Promise<SpotCommentPage> {
    return (
        await axios.get(`${BASE_URL}/public/spot/${spotId}/comments`, {
            params: { page },
            withCredentials: true,
        })
    ).data;
}

export async function getSpotCommentsMedia(commentId: number) {
    return (
        await axios.get(`${BASE_URL}/public/spot/comments-media/${commentId}`)
    ).data;
}

export async function addSpotComment(addSpotCommentDto: AddSpotCommentDto) {
    const { spotId, text, rating, mediaFiles } = addSpotCommentDto;
    const formData = new FormData();

    for (const file of mediaFiles) {
        formData.append("mediaFiles", file);
    }

    formData.append(
        "spotComment",
        JSON.stringify({
            text,
            rating,
        }),
    );

    return (
        await axios.post(`${BASE_URL}/spot/${spotId}/comments`, formData, {
            withCredentials: true,
        })
    ).data;
}

type voteCommentProps = {
    commentId: number;
    isUpvote: boolean;
};

export async function voteComment({ commentId, isUpvote }: voteCommentProps) {
    return await axios.patch(
        `${BASE_URL}/spot/comments/${commentId}/vote`,
        null,
        {
            params: { isUpvote },
            withCredentials: true,
        },
    );
}

export async function getSpotCommentVoteInfo(
    commentId: number,
): Promise<SpotCommentVoteInfoDto> {
    return (
        await axios.get(`${BASE_URL}/spot/comments/vote-type`, {
            params: { commentId },
            withCredentials: true,
        })
    ).data;
}
