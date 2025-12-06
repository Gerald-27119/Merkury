import PostCategoryDto from "./postCategoryDto";
import TagDto from "../tagDto";

export default interface PostCategoryAndTagsDto {
    categories: PostCategoryDto[];
    tags: TagDto[];
}
