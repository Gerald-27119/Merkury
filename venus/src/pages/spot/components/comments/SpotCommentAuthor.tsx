import SpotCommentAuthor from "../../../../model/interface/spot/comment/spotCommentAuthor";

type SpotCommentAuthorProps = {
  author: SpotCommentAuthor;
};

export default function SpotCommentAuthor({ author }: SpotCommentAuthorProps) {
  return (
    <div>
      <img src={author.profilePhotoUrl} alt={author.username} />
      <p>{author.username}</p>
    </div>
  );
}
