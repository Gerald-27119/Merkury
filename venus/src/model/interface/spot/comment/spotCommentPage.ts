import SpotComment from "./spotComment";

export default interface SpotCommentPage {
  items: SpotComment[];
  nextPage?: number;
}
