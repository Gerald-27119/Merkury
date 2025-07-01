import SpotCommentDto from "./spotCommentDto";

export default interface SpotCommentPage {
    content: SpotCommentDto[];
    number: number;
    totalPages: number;
}
