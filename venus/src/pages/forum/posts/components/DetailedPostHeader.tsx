interface DetailedPostHeaderProps {
    author: { username: string; profilePhoto: string };
    publishDate: string | Date;
}

export default function DetailedPostHeader({
    author,
    publishDate,
}: DetailedPostHeaderProps) {
    return (
        <div className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
                <img
                    src={author.profilePhoto}
                    alt="profileImage"
                    className="h-12 w-12 cursor-pointer rounded-full"
                />
                <span className="cursor-pointer">{author.username}</span>
            </div>
            <span>{new Date(publishDate).toLocaleDateString()}</span>
        </div>
    );
}
