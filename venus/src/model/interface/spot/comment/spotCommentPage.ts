import SpotCommentDto from "./spotCommentDto";

export default interface SpotCommentPage {
  content: SpotCommentDto[];
  nextPage?: number;
}
