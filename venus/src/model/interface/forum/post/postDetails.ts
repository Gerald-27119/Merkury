import CategoryDto from "../categoryDto";
import TagDto from "../tagDto";
import PostCommentDto from "../postComment/postCommentDto";
import PostAuthorDto from "../postAuthorDto";

export default interface PostDetails {
    id: number;
    title: string;
    content: string;
    category: CategoryDto;
    tags: TagDto[];
    author: PostAuthorDto;
    isAuthor: boolean;
    publishDate: string;
    views: number;
    upVotes: number;
    downVotes: number;
    isUpVoted: boolean;
    isDownVoted: boolean;
    comments: PostCommentDto[];
}
