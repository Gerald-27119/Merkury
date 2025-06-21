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
        className="h-8 rounded-full"
      />
      <p className="text-2xl">{author.username}</p>
    </div>
  );
}
