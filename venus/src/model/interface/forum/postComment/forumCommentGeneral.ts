import ForumAuthorDto from "../forumAuthorDto";

export default interface ForumCommentGeneral {
    id: number;
    content: string;
    upVotes: number;
    downVotes: number;
    repliesCount: number;
    publishDate: string;
    author: ForumAuthorDto;
    isAuthor: boolean;
    isUpVoted: boolean;
    isDownVoted: boolean;
    isReply: boolean;
}
