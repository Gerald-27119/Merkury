import ForumCategoryDto from "../forumCategoryDto";
import ForumTagDto from "../forumTagDto";

export default interface PostDto {
    title: string;
    content: string;
    category: ForumCategoryDto;
    tags: ForumTagDto[];
}
