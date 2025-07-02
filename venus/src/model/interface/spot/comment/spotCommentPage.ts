import SpotCommentDto from "./spotCommentDto";

export default interface SpotCommentPage {
    content: SpotCommentDto[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}
