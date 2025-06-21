import SpotComment from "./spotComment";

export default interface SpotCommentPage {
  content: SpotComment[];
  nextPage?: number;
}
