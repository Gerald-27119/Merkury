import SpotCommentAuthorDto from "../../../../model/interface/spot/comment/spotCommentAuthorDto";

type SpotCommentAuthorProps = {
    author: SpotCommentAuthorDto;
};

export default function SpotCommentAuthor({ author }: SpotCommentAuthorProps) {
    return (
        <div className="flex items-center space-x-3">
            <img
                src={author.profilePhotoUrl}
                alt={author.username}
                className="aspect-square h-10 rounded-full object-cover"
            />
            <p className="text-3xl">{author.username}</p>
        </div>
    );
}
