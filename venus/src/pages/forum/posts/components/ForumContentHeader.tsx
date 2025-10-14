interface DetailedPostHeaderProps {
    author: { username: string; profilePhoto: string };
    publishDate: string | Date;
    isReply?: boolean;
    onAuthorClick: () => void;
}

export default function ForumContentHeader({
    author,
    publishDate,
    isReply,
    onAuthorClick,
}: DetailedPostHeaderProps) {
    return (
        <div className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3" onClick={onAuthorClick}>
                <img
                    src={author.profilePhoto}
                    alt="profileImage"
                    className={`cursor-pointer rounded-full ${isReply ? "h-8 w-8" : "h-12 w-12"}`}
                />
                <span className="cursor-pointer">{author.username}</span>
            </div>
            <span>{new Date(publishDate).toLocaleDateString()}</span>
        </div>
    );
}
