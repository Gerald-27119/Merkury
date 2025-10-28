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
        <div className="mb-2 flex w-full justify-end space-x-3 text-lg">
            <img
                src={authorProfilePhotoUrl}
                alt={`${authorName}_profile_photo`}
                className="aspect-square w-7 rounded-full"
            />
            <span>{authorName}</span>
            <span>{publishDate}</span>
        </div>
    );
}
