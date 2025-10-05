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
                className="3xl:h-10 aspect-square h-7 rounded-full object-cover 2xl:h-8"
            />
            <p className="3xl:text-3xl text-xl 2xl:text-2xl">
                {author.username}
            </p>
        </div>
    );
}
