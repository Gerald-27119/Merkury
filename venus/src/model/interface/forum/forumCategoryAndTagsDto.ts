import ForumCategoryDto from "./forumCategoryDto";
import TagDto from "../tagDto";

export default interface ForumCategoryAndTagsDto {
    categories: ForumCategoryDto[];
    tags: TagDto[];
}
