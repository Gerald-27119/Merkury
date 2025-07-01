import PostGeneral from "./postGeneral";

export default interface PaginatedPosts {
    content: PostGeneral[];
    totalPages: number;
    totalElements: number;
    number: number;
}
