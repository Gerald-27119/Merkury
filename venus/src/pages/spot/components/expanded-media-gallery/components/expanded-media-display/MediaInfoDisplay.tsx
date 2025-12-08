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
        <div className="3xl:mb-2 3xl:mr-0 flex w-full justify-end space-x-3 text-lg 2xl:mr-38 2xl:mb-3">
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
