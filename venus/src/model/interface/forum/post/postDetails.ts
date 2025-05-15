import CategoryDto from "../categoryDto";
import TagDto from "../tagDto";
import PostCommentDto from "../postComment/postCommentDto";

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
  comments: PostCommentDto[];
}
