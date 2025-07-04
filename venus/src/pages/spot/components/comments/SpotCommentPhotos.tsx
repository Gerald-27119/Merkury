import SpotCommentPhoto from "../../../../model/interface/spot/comment/spotCommentPhoto";

type SpotCommentPhotosProps = {
    photos: SpotCommentPhoto[];
    spotId: number;
    commentId: number;
    numberOfPhotos: number;
};

export default function SpotCommentPhotos({
    photos,
    spotId,
    commentId,
    numberOfPhotos,
}: SpotCommentPhotosProps) {
    return (
        <ul className="grid grid-cols-3 gap-3">
            {photos.map((photo, idx) => (
                <li key={photo.id} className="relative">
                    <img
                        src={photo.url}
                        alt="spot photo"
                        className="aspect-square w-40"
                    />
                    {idx === 2 && numberOfPhotos > 3 && (
                        <div className="bg-darkBg/88 absolute inset-0 flex cursor-pointer items-center justify-center">
                            <span className="text-lg font-semibold text-white">
                                see more...
                            </span>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}
