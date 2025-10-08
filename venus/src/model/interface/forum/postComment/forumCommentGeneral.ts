export default interface ForumCommentGeneral {
    id: number;
    content: string;
    upVotes: number;
    downVotes: number;
    repliesCount: number;
    publishDate: string;
    author: string;
    isAuthor: boolean;
    isUpVoted: boolean;
    isDownVoted: boolean;
}
