import SpotCommentPhoto from "../../../../model/interface/spot/comment/spotCommentPhoto";
import { useBoolean } from "../../../../hooks/useBoolean";
import { useQuery } from "@tanstack/react-query";
import { getSpotCommentsPhotos } from "../../../../http/comments";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";

type SpotCommentPhotosProps = {
    initialPhotos: SpotCommentPhoto[];
    spotId: number;
    commentId: number;
    numberOfPhotos: number;
};

export default function SpotCommentPhotos({
    initialPhotos,
    spotId,
    commentId,
    numberOfPhotos,
}: SpotCommentPhotosProps) {
    const [isShowMorePhotos, showMorePhotos, _, __] = useBoolean();

    const {
        data: photosData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["spot-comment-photos", spotId, commentId],
        queryFn: () => getSpotCommentsPhotos(spotId, commentId),
        enabled: false,
    });

    const handleShowMorePhotos = async () => {
        showMorePhotos();
        await refetch();
    };

    const photos = isShowMorePhotos
        ? (photosData ?? initialPhotos)
        : initialPhotos;

    return (
        <>
            <ul
                className={`${numberOfPhotos < 3 ? "flex space-x-3" : "grid grid-cols-3 gap-3"}`}
            >
                {photos.map((photo: SpotCommentPhoto, idx: number) => (
                    <li key={photo.id} className="relative">
                        <img
                            src={photo.url}
                            alt="spot photo"
                            className="aspect-square w-40"
                        />
                        {idx === 2 &&
                            numberOfPhotos > 3 &&
                            !isShowMorePhotos && (
                                <div
                                    onClick={handleShowMorePhotos}
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
