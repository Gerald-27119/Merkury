import SpotCommentPhoto from "../../../../model/interface/spot/comment/spotCommentPhoto";

type SpotCommentPhotosProps = {
    photos: SpotCommentPhoto[];
};

export default function SpotCommentPhotos({ photos }: SpotCommentPhotosProps) {
    return (
        <ul className="flex items-center space-x-3">
            {photos.map((photo) => (
                <li key={photo.id}>
                    <img
                        src={photo.url}
                        alt="spot photo"
                        className="aspect-square w-40"
                    />
                </li>
            ))}
        </ul>
    );
}
