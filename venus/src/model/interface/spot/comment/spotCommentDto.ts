import SpotCommentPhoto from "./spotCommentPhoto";
import SpotCommentAuthorDto from "./spotCommentAuthorDto";

export default interface SpotCommentDto {
  id: number;
  text: string;
  rating: number;
  upvotes: number;
  downvotes: number;
  publishDate: string;
  author: SpotCommentAuthorDto;
  isAuthor: boolean;
  isUpVoted: boolean;
  isDownVoted: boolean;
  numberOfPhotos: number;
  photoList: SpotCommentPhoto[];
}
