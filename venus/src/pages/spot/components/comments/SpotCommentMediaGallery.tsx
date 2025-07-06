import { useBoolean } from "../../../../hooks/useBoolean";
import { useQuery } from "@tanstack/react-query";
import { getSpotCommentsMedia } from "../../../../http/comments";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import SpotCommentMediaDto from "../../../../model/interface/spot/comment/spotCommentMediaDto";
import { MediaType } from "../../../../model/enum/mediaType";

type SpotCommentMediaGalleryProps = {
    initialMedia: SpotCommentMediaDto[];
    spotId: number;
    commentId: number;
    numberOfMedia: number;
};

export default function SpotCommentMediaGallery({
    initialMedia,
    spotId,
    commentId,
    numberOfMedia,
}: SpotCommentMediaGalleryProps) {
    const [isShowMoreMedia, showMoreMedia, _, __] = useBoolean();

    const {
        data: mediaData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["spot-comment-media", spotId, commentId],
        queryFn: () => getSpotCommentsMedia(spotId, commentId),
        enabled: false,
    });

    const handleShowMoreMedia = async () => {
        showMoreMedia();
        await refetch();
    };

    const mediaList = isShowMoreMedia
        ? (mediaData ?? initialMedia)
        : initialMedia;

    return (
        <>
            <ul
                className={`${numberOfMedia < 3 ? "flex space-x-3" : "grid grid-cols-3 gap-3"}`}
            >
                {mediaList.map((media: SpotCommentMediaDto, idx: number) => (
                    <li key={media.id} className="relative">
                        {media.mediaType === MediaType.VIDEO ? (
                            <p>video</p>
                        ) : (
                            <img
                                src={media.url}
                                alt="spot photo"
                                className="aspect-square w-40"
                            />
                        )}

                        {idx === 2 && numberOfMedia > 3 && !isShowMoreMedia && (
                            <div
                                onClick={handleShowMoreMedia}
                                className="bg-darkBg/88 absolute inset-0 flex cursor-pointer items-center justify-center"
                            >
                                <span className="text-lg font-semibold">
                                    see more...
                                </span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {isError && <p>Failed to download rest of the photos!</p>}
            {isLoading && <LoadingSpinner />}
        </>
    );
}
