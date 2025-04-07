export default interface Comment {
  id: number;
  text: string;
  rating: number;
  upvotes: number;
  downvotes: number;
  publishDate: string;
  author: string;
  isAuthor: boolean;
  isUpvoted: boolean;
  isDownVoted: boolean;
}
