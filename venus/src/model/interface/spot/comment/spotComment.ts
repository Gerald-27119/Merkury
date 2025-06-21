import SpotCommentPhoto from "./spotCommentPhoto";
import SpotCommentAuthor from "./spotCommentAuthor";

export default interface SpotComment {
  id: number;
  text: string;
  rating: number;
  upVotes: number;
  downVotes: number;
  publishDate: string;
  author: SpotCommentAuthor;
  isAuthor: boolean;
  isUpVoted: boolean;
  isDownVoted: boolean;
  numberOfPhotos: number;
  photoList: SpotCommentPhoto[];
}
