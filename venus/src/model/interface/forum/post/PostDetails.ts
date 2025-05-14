import CategoryDto from "../CategoryDto";
import TagDto from "../TagDto";
import postCommentDto from "../postComment/postCommentDto";

export default interface PostDetails {
  id: number;
  title: string;
  content: string;
  category: CategoryDto;
  tags: TagDto[];
  author: string;
  isAuthor: boolean;
  publishDate: string;
  views: number;
  upVotes: number;
  downVotes: number;
  isUpVoted: boolean;
  isDownVoted: boolean;
  comments: postCommentDto[];
}
