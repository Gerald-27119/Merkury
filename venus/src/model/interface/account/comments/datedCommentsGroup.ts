import Comment from "./comment";

export default interface DatedCommentsGroup {
  addDate: string;
  spotName: string;
  comments: Comment[];
}
