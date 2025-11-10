import ForumCategoryDto from "../forumCategoryDto";
import ForumAuthorDto from "../forumAuthorDto";
import TagDto from "../../tagDto";

export default interface PostDetails {
    id: number;
    title: string;
    content: string;
    category: ForumCategoryDto;
    tags: TagDto[];
    author: ForumAuthorDto;
    isAuthor: boolean;
    isFollowed: boolean;
    publishDate: string;
    views: number;
    upVotes: number;
    downVotes: number;
    isUpVoted: boolean;
    isDownVoted: boolean;
    commentsCount: number;
}
