import ForumCommentGeneral from "./forumCommentGeneral";

export default interface ForumCommentReplyPage {
    comments: ForumCommentGeneral[];
    nextCursor: number | null;
}
