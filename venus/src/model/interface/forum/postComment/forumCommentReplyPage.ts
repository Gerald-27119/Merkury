import ForumCommentDto from "./forumCommentDto";

export default interface ForumCommentReplyPage {
    comments: ForumCommentDto[];
    nextCursor: number | null;
}
