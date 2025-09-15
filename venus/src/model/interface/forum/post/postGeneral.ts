import ForumCategoryDto from "../forumCategoryDto";
import TagDto from "../../tagDto";

export default interface PostGeneral {
    id: number;
    title: string;
    slugTitle: string;
    content: string;
    category: ForumCategoryDto;
    tags: TagDto[];
    views: number;
    numberOfComments: number;
    isAuthor: boolean;
}
