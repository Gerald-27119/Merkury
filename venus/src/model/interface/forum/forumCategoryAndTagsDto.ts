import ForumCategoryDto from "./forumCategoryDto";
import ForumTagDto from "./forumTagDto";

export default interface ForumCategoryAndTagsDto {
    categories: ForumCategoryDto[];
    tags: ForumTagDto[];
}
