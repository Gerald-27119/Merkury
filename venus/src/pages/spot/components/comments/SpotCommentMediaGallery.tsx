import { useBoolean } from "../../../../hooks/useBoolean";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSpotCommentsMedia } from "../../../../http/comments";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import SpotCommentMediaDto from "../../../../model/interface/spot/comment/spotCommentMediaDto";
import { MediaType } from "../../../../model/enum/mediaType";
import { FaRegCirclePlay } from "react-icons/fa6";
import ReactPlayer from "react-player";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { expandedSpotMediaGalleryAction } from "../../../../redux/expanded-spot-media-gallery";
import { expandedSpotMediaGalleryModalsActions } from "../../../../redux/expanded-spot-media-gallery-modals";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { SpotExpandedGallerySortingType } from "../../../../model/enum/spot/spotExpandedGallerySortingType";
import { getExpandedSpotMediaGalleryPagePosition } from "../../../../http/spots-data";
import { useEffect, useState } from "react";

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
    const [clickedMediaData, setClickedMediaData] = useState<{
        mediaId: number | null;
        mediaType: MediaType | null;
    }>();

    const dispatch = useDispatchTyped();

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

    const { sorting } = useSelectorTyped(
        (state) => state.expandedSpotMediaGallery,
    );

    const { mutateAsync, data } = useMutation({
        mutationFn: ({
            spotId,
            mediaId,
            mediaType,
            sorting,
        }: {
            spotId: number;
            mediaId: number;
            mediaType: MediaType;
            sorting: SpotExpandedGallerySortingType;
        }) =>
            getExpandedSpotMediaGalleryPagePosition(
                spotId,
                mediaId,
                mediaType,
                sorting,
            ),
    });

    const handleClickClickMedia = async (
        mediaType: MediaType,
        mediaId: number,
    ) => {
        setClickedMediaData({ mediaId, mediaType });
        await mutateAsync({
            spotId: spotId!,
            mediaId: mediaId,
            mediaType: mediaType,
            sorting,
        });
    };

    useEffect(() => {
        if (data) {
            dispatch(
                expandedSpotMediaGalleryAction.setExpandedGalleryMediaId({
                    mediaId: clickedMediaData?.mediaId!,
                }),
            );
            dispatch(
                expandedSpotMediaGalleryAction.setExpandedGalleryMediaPagePosition(
                    { mediaPagePosition: data.mediaPagePosition },
                ),
            );
            dispatch(
                expandedSpotMediaGalleryAction.setExpandedGalleryMediaType({
                    mediaType: clickedMediaData?.mediaType!,
                }),
            );
            dispatch(expandedSpotMediaGalleryModalsActions.openModals());
        }
    }, [data]);

    return (
        <>
            <ul
                className={`${numberOfMedia < 3 ? "flex space-x-3" : "text-darkText grid grid-cols-3 gap-3"}`}
            >
                {mediaList.map((media: SpotCommentMediaDto, idx: number) => (
                    <li key={media.id} className="relative cursor-pointer">
                        {media.genericMediaType === MediaType.VIDEO ? (
                            <>
                                <div
                                    onClick={() =>
                                        handleClickClickMedia(
                                            media.genericMediaType,
                                            media.id,
                                        )
                                    }
                                    className="bg-darkBg/80 absolute inset-0 z-10 flex cursor-pointer items-center justify-center text-2xl 2xl:text-4xl"
                                >
                                    <FaRegCirclePlay />
                                </div>
                                <div className="absolute inset-0 z-0 flex items-center justify-center">
                                    <ReactPlayer
                                        playing={false}
                                        src={media.url}
                                        controls={false}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            aspectRatio: "16/9",
                                            "--controls": "none",
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <img
                                onClick={() =>
                                    handleClickClickMedia(
                                        media.genericMediaType,
                                        media.id,
                                    )
                                }
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
                                <span className="text-xs font-semibold 2xl:text-lg">
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
