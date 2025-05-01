import CategoryDto from "../CategoryDto";
import TagDto from "../TagDto";
import postCommentDto from "../postComment/postCommentDto";

export default interface PostDetails {
  id: number;
  title: String;
  content: String;
  category: CategoryDto;
  tags: TagDto[];
  author: string;
  isAuthor: boolean;
  publishDate: string;
  views: number;
  upvotes: number;
  downvotes: number;
  isUpvoted: boolean;
  isDownvoted: boolean;
  comments: postCommentDto[];
}
