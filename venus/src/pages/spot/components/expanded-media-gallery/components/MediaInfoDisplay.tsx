type MediaInfoDisplayProps = {
    authorName: string;
    authorProfilePhotoUrl: string;
    publishDate: string;
};

export default function MediaInfoDisplay({
    authorName,
    authorProfilePhotoUrl,
    publishDate,
}: MediaInfoDisplayProps) {
    return (
        <div className="flex">
            <img
                src={authorProfilePhotoUrl}
                alt={`${authorName}_profile_photo`}
                className="aspect-square rounded-full"
            />
            <span>{authorName}</span>
            <span>{publishDate}</span>
        </div>
    );
}
