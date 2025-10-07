import ForumCategoryDto from "../forumCategoryDto";
import PostAuthorDto from "../postAuthorDto";
import TagDto from "../../tagDto";

export default interface PostDetails {
    id: number;
    title: string;
    content: string;
    category: ForumCategoryDto;
    tags: TagDto[];
    author: PostAuthorDto;
    isAuthor: boolean;
    publishDate: string;
    views: number;
    upVotes: number;
    downVotes: number;
    isUpVoted: boolean;
    isDownVoted: boolean;
    commentsCount: number;
}
