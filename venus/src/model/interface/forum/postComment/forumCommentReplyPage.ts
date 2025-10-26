import ForumCommentGeneral from "./forumCommentGeneral";

export default interface ForumCommentReplyPage {
    comments: ForumCommentGeneral[];
    nextCursorId: number | null;
    nextCursorDate: string | null;
}
