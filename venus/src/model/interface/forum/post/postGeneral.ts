import ForumCategoryDto from "../forumCategoryDto";
import ForumTagDto from "../forumTagDto";

export default interface PostGeneral {
    id: number;
    title: string;
    content: string;
    category: ForumCategoryDto;
    tags: ForumTagDto[];
    views: number;
    numberOfComments: number;
    isAuthor: boolean;
}
