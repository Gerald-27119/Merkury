export default interface Comment {
  id: number;
  text: string;
  rating: number;
  upVotes: number;
  downVotes: number;
  publishDate: string;
  author: string;
  isAuthor: boolean;
  isUpVoted: boolean;
  isDownVoted: boolean;
}
