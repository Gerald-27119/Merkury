import SpotCommentPhoto from "./spotCommentPhoto";

export default interface SpotComment {
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
  numberOfPhotos: number;
  photos: SpotCommentPhoto[];
}
