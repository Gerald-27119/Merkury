import ForumAuthorDto from "./forumAuthorDto";

export default interface TrendingPostDto {
    id: number;
    title: string;
    slugTitle: string;
    author: ForumAuthorDto;
    publishDate: string;
}
