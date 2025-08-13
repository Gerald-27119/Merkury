import ForumCategoryDto from "../forumCategoryDto";
import ForumTagDto from "../forumTagDto";
import PostCommentDto from "../postComment/postCommentDto";
import PostAuthorDto from "../postAuthorDto";

export default interface PostDetails {
    id: number;
    title: string;
    content: string;
    category: ForumCategoryDto;
    tags: ForumTagDto[];
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
