import PostCommentGeneral from "./postCommentGeneral";

export default interface PostCommentReplyPage {
    comments: PostCommentGeneral[];
    nextCursorId: number | null;
    nextCursorDate: string | null;
}
