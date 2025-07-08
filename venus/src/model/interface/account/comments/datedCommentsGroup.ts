import Comment from "./comment";

export default interface DatedCommentsGroup {
    date: string;
    spotName: string;
    comments: Comment[];
}
