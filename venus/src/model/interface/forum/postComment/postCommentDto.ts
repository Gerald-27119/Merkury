export default interface postCommentDto {
  id: number;
  text: string;
  upVotes: number;
  downVotes: number;
  publishDate: string;
  author: string;
  isAuthor: boolean;
  isUpVoted: boolean;
  isDownVoted: boolean;
}
