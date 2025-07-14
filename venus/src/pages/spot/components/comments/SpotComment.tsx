import { formatPublishDate } from "../../../../utils/spot-utils";
import { Rate } from "antd";
import SpotCommentDto from "../../../../model/interface/spot/comment/spotCommentDto";
import SpotCommentAuthor from "./SpotCommentAuthor";
import SpotCommentVotesPanel from "./SpotCommentVotesPanel";
import SpotCommentMediaGallery from "./SpotCommentMediaGallery";

type SpotCommentProps = {
    comment: SpotCommentDto;
    spotId: number;
};

export default function SpotComment({ comment, spotId }: SpotCommentProps) {
    return (
        <div className="dark:bg-second flex min-h-fit flex-col items-center rounded-2xl px-4 lg:py-2">
            <div className="my-3 flex w-full flex-col items-start">
                <SpotCommentAuthor author={comment.author} />
                <div className="flex items-baseline">
                    <div className="custom-rate-spot-comment text-ratingStarColor mt-2 mr-3.5 inline-flex min-w-fit">
                        <Rate
                            data-testid="spot-rating"
                            disabled
                            allowHalf
                            value={comment.rating}
                        />
                    </div>
                    <p className="text-lg">
                        {formatPublishDate(comment.publishDate)}
                    </p>
                </div>
            </div>
            <p className="mb-3 w-full text-left">{comment.text}</p>
            {comment.mediaList && (
                <SpotCommentMediaGallery
                    initialMedia={comment.mediaList}
                    commentId={comment.id}
                    spotId={spotId}
                    numberOfMedia={comment.numberOfMedia}
                />
            )}
            <SpotCommentVotesPanel
                upvotes={comment.upvotes}
                downvotes={comment.downvotes}
            />
        </div>
    );
}
