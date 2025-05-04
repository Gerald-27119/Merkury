import PostGeneral from "./PostGeneral";

export default interface PaginatedPosts {
  content: PostGeneral[];
  totalPages: number;
  totalElements: number;
  number: number;
}
